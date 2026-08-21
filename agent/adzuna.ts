import { searchJobs } from '@/lib/adzuna'
import { formatSalary, MATCH_THRESHOLD } from '@/lib/utils'
import { scoreJobWithGemini, type CandidateProfileSummary } from '@/agent/matcher'
import type { createInsforgeServer } from '@/lib/insforge-server'

type InsforgeServerClient = Awaited<ReturnType<typeof createInsforgeServer>>

export type DiscoverJobsParams = {
  userId: string
  runId: string
  jobTitle: string
  location?: string
  profile: CandidateProfileSummary
  insforge: InsforgeServerClient
}

export type DiscoverJobsResult = {
  success: boolean
  totalFound: number
  strongMatches: number
  jobs?: Array<{
    id: string
    title: string
    company: string
    location?: string
    salary?: string | null
    match_score?: number
    match_reason?: string
    matched_skills?: string[]
    missing_skills?: string[]
    found_at: string
  }>
  error?: string
}

export async function discoverAndScoreJobs({
  userId,
  runId,
  jobTitle,
  location,
  profile,
  insforge,
}: DiscoverJobsParams): Promise<DiscoverJobsResult> {
  try {
    // 1. Fetch raw jobs from Adzuna
    const rawJobs = await searchJobs(jobTitle, location)

    await insforge.database.from('agent_logs').insert([
      {
        run_id: runId,
        user_id: userId,
        message: `Discovered ${rawJobs.length} potential listings from Adzuna for "${jobTitle}"`,
        level: 'info',
      },
    ])

    if (rawJobs.length === 0) {
      return {
        success: true,
        totalFound: 0,
        strongMatches: 0,
        jobs: [],
      }
    }

    // 2. Score jobs in parallel with Gemini AI
    const scoredJobs = await Promise.all(
      rawJobs.map(async (job) => {
        try {
          const scoreResult = await scoreJobWithGemini(job, profile)
          return { job, scoreResult }
        } catch (scoreErr) {
          console.warn(`[agent/adzuna] Failed to score job "${job.title}":`, scoreErr)
          return {
            job,
            scoreResult: {
              matchScore: 65,
              matchReason: 'General role matching standard technical qualifications.',
              matchedSkills: [],
              missingSkills: [],
            },
          }
        }
      }),
    )

    // 3. Map to database records
    const recordsToInsert = scoredJobs.map(({ job, scoreResult }) => {
      const contractType = job.contract_type?.toLowerCase()
      let jobType: 'fulltime' | 'parttime' | 'contract' = 'fulltime'
      if (contractType?.includes('part')) jobType = 'parttime'
      else if (contractType?.includes('contract')) jobType = 'contract'

      return {
        user_id: userId,
        run_id: runId,
        source: 'search' as const,
        source_url: job.redirect_url,
        external_apply_url: job.redirect_url,
        title: job.title.replace(/<\/?[^>]+(>|$)/g, ''), // Strip any stray HTML tags
        company: job.company.display_name,
        location: job.location.display_name,
        salary: formatSalary(job.salary_min, job.salary_max),
        job_type: jobType,
        about_role: job.description.replace(/<\/?[^>]+(>|$)/g, ''),
        match_score: scoreResult.matchScore,
        match_reason: scoreResult.matchReason,
        matched_skills: scoreResult.matchedSkills,
        missing_skills: scoreResult.missingSkills,
        found_at: new Date().toISOString(),
      }
    })

    // 4. Save to jobs table
    const { data: insertedData, error: insertError } = await insforge.database
      .from('jobs')
      .insert(recordsToInsert)
      .select('id, title, company, location, salary, match_score, match_reason, matched_skills, missing_skills, found_at')

    if (insertError) {
      console.error('[agent/adzuna] Error inserting jobs into DB:', insertError)
      throw new Error(`Database insert error: ${insertError.message}`)
    }

    const savedJobs = insertedData || []
    const strongMatches = savedJobs.filter(
      (j) => (j.match_score || 0) >= MATCH_THRESHOLD,
    ).length

    // 5. Log success
    await insforge.database.from('agent_logs').insert([
      {
        run_id: runId,
        user_id: userId,
        message: `Saved ${savedJobs.length} jobs to database with ${strongMatches} strong matches (≥${MATCH_THRESHOLD}%).`,
        level: 'success',
      },
    ])

    return {
      success: true,
      totalFound: savedJobs.length,
      strongMatches,
      jobs: savedJobs,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('[agent/adzuna] discovery error:', message)

    try {
      await insforge.database.from('agent_logs').insert([
        {
          run_id: runId,
          user_id: userId,
          message: `Job discovery encountered an issue: ${message}`,
          level: 'error',
        },
      ])
    } catch {
      // Ignore logging failure on error
    }

    return {
      success: false,
      totalFound: 0,
      strongMatches: 0,
      error: message,
    }
  }
}
