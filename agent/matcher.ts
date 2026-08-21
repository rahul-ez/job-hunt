import { GoogleGenAI } from '@google/genai'
import type { AdzunaJob } from '@/lib/adzuna'

export type JobMatchResult = {
  matchScore: number
  matchReason: string
  matchedSkills: string[]
  missingSkills: string[]
}

export type CandidateProfileSummary = {
  fullName?: string | null
  currentTitle?: string | null
  experienceLevel?: string | null
  yearsExperience?: number | null
  skills?: string[] | null
  industries?: string[] | null
  workExperience?: unknown
  education?: unknown
  jobTitlesSeeking?: string[] | null
}

export async function scoreJobWithGemini(
  job: AdzunaJob,
  profile: CandidateProfileSummary,
): Promise<JobMatchResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment.')
  }

  const ai = new GoogleGenAI({ apiKey })

  const prompt = `You are an expert technical recruiter and career coach. Score how well the candidate's profile matches this job opening.

CANDIDATE PROFILE:
- Current Title: ${profile.currentTitle || 'Not specified'}
- Experience Level: ${profile.experienceLevel || 'Not specified'}
- Years of Experience: ${profile.yearsExperience || 0}
- Skills: ${profile.skills && profile.skills.length > 0 ? profile.skills.join(', ') : 'Not specified'}
- Desired Roles: ${profile.jobTitlesSeeking && profile.jobTitlesSeeking.length > 0 ? profile.jobTitlesSeeking.join(', ') : 'Not specified'}
- Work Experience: ${JSON.stringify(profile.workExperience || [])}
- Education: ${JSON.stringify(profile.education || {})}

JOB LISTING:
- Title: ${job.title}
- Company: ${job.company.display_name}
- Location: ${job.location.display_name}
- Description Snippet: ${job.description}

Evaluate the match realistically:
1. matchScore: Integer 0 to 100 (90-100: exceptional match, 70-89: strong match with most core skills, 50-69: moderate match with some transferable skills, below 50: weak match).
2. matchReason: Concise 2-3 sentence explanation highlighting specific strengths and any gaps.
3. matchedSkills: Array of skill names candidate has that align with the role.
4. missingSkills: Array of skill names required/preferred by the role that candidate might lack.

Return ONLY a valid JSON object matching this exact shape:
{
  "matchScore": 88,
  "matchReason": "Strong alignment with frontend engineering requirements and modern React ecosystem...",
  "matchedSkills": ["React", "TypeScript", "Tailwind CSS"],
  "missingSkills": ["GraphQL", "Next.js App Router"]
}`

  let responseText = ''
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    })
    responseText = response.text || ''
  } catch {
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    })
    responseText = response.text || ''
  }

  if (!responseText) {
    throw new Error('Empty response received from Gemini scoring model.')
  }

  try {
    const parsed = JSON.parse(responseText)
    const score = typeof parsed.matchScore === 'number' ? Math.min(100, Math.max(0, Math.round(parsed.matchScore))) : 70
    return {
      matchScore: score,
      matchReason: typeof parsed.matchReason === 'string' ? parsed.matchReason : 'Match evaluated based on profile skills and job requirements.',
      matchedSkills: Array.isArray(parsed.matchedSkills) ? parsed.matchedSkills.map(String) : [],
      missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills.map(String) : [],
    }
  } catch (err) {
    throw new Error(`Failed to parse AI scoring result JSON: ${String(err)}`)
  }
}
