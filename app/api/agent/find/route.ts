import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createInsforgeServer } from '@/lib/insforge-server'
import { getPostHogClient } from '@/lib/posthog-server'
import { discoverAndScoreJobs } from '@/agent/adzuna'
import type { CandidateProfileSummary } from '@/agent/matcher'

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer()
    const { data: userData, error: userError } = await insforge.auth.getCurrentUser()
    const user = userData?.user

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 },
      )
    }

    const body = await req.json().catch(() => ({}))
    const jobTitle = typeof body.jobTitle === 'string' ? body.jobTitle.trim() : ''
    const location = typeof body.location === 'string' ? body.location.trim() : ''

    if (!jobTitle) {
      return NextResponse.json(
        { success: false, error: 'Job title is required.' },
        { status: 400 },
      )
    }

    // 1. Fetch user profile
    const { data: profileRow } = await insforge.database
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const candidateProfile: CandidateProfileSummary = profileRow
      ? {
          fullName: profileRow.full_name,
          currentTitle: profileRow.current_title,
          experienceLevel: profileRow.experience_level,
          yearsExperience: profileRow.years_experience,
          skills: profileRow.skills,
          industries: profileRow.industries,
          workExperience: profileRow.work_experience,
          education: profileRow.education,
          jobTitlesSeeking: profileRow.job_titles_seeking,
        }
      : {
          currentTitle: jobTitle,
        }

    // 2. Create agent_run record
    const { data: runData, error: runError } = await insforge.database
      .from('agent_runs')
      .insert([
        {
          user_id: user.id,
          status: 'running',
          job_title_searched: jobTitle,
          location_searched: location,
          jobs_found: 0,
        },
      ])
      .select('id')
      .single()

    if (runError || !runData) {
      console.error('[api/agent/find] Failed to initialize agent run:', runError)
      return NextResponse.json(
        { success: false, error: 'Failed to initialize discovery run.' },
        { status: 500 },
      )
    }

    const runId = runData.id

    // 3. Track PostHog event: job_search_started
    const posthog = getPostHogClient()
    if (posthog) {
      posthog.capture({
        distinctId: user.id,
        event: 'job_search_started',
        properties: {
          userId: user.id,
          jobTitle,
          location,
        },
      })
    }

    // 4. Run discovery and scoring
    const result = await discoverAndScoreJobs({
      userId: user.id,
      runId,
      jobTitle,
      location,
      profile: candidateProfile,
      insforge,
    })

    if (!result.success) {
      await insforge.database
        .from('agent_runs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', runId)

      return NextResponse.json(
        { success: false, error: result.error || 'Failed to complete job discovery.' },
        { status: 500 },
      )
    }

    // 5. Track PostHog event: job_found for each discovered job
    if (posthog && result.jobs && result.jobs.length > 0) {
      for (const savedJob of result.jobs) {
        posthog.capture({
          distinctId: user.id,
          event: 'job_found',
          properties: {
            userId: user.id,
            source: 'search',
            matchScore: savedJob.match_score || 0,
          },
        })
      }
    }

    // 6. Complete agent_run record
    await insforge.database
      .from('agent_runs')
      .update({
        status: 'completed',
        jobs_found: result.totalFound,
        completed_at: new Date().toISOString(),
      })
      .eq('id', runId)

    revalidatePath('/find-jobs')
    revalidatePath('/dashboard')

    const message = `Found ${result.totalFound} jobs and saved ${result.strongMatches} strong matches.`

    return NextResponse.json({
      success: true,
      count: result.totalFound,
      strongMatchesCount: result.strongMatches,
      message,
      jobs: result.jobs,
    })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[api/agent/find] Unexpected error:', errorMsg)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during job discovery.' },
      { status: 500 },
    )
  }
}
