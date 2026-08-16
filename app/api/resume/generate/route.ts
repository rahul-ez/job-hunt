import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import React from 'react'
import { renderToBuffer, type DocumentProps } from '@react-pdf/renderer'
import { GoogleGenAI } from '@google/genai'
import { createInsforgeServer } from '@/lib/insforge-server'
import { ResumePDF, type ResumeContent } from '@/components/pdf/ResumePDF'

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer()
    const { data: userData, error: userError } = await insforge.auth.getCurrentUser()
    const user = userData?.user

    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    const { data: profileRow, error: profileError } = await insforge.database
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profileRow) {
      return NextResponse.json(
        { success: false, error: 'Profile not found. Please fill out your profile details first.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('[api/resume/generate] GEMINI_API_KEY is not defined in environment.')
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured.' },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })

    const prompt = `You are a professional resume writer. Given candidate profile data, synthesize a high-impact, professional single-page resume layout.

Return ONLY a valid JSON object matching this exact shape:
{
  "summary": "3-4 sentence powerful professional summary emphasizing candidate strengths, experience level, and key domains.",
  "workExperience": [
    {
      "company": "string",
      "jobTitle": "string",
      "startDate": "YYYY-MM or string",
      "endDate": "YYYY-MM or Present",
      "bullets": [
        "Action-oriented achievement bullet point 1 starting with strong verb",
        "Bullet point 2 with metrics/outcomes",
        "Bullet point 3 detailing technologies/impact"
      ]
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "education": {
    "degree": "string",
    "field": "string",
    "institution": "string",
    "year": "string"
  }
}

Candidate Raw Profile Data:
${JSON.stringify({
  fullName: profileRow.full_name,
  currentTitle: profileRow.current_title,
  experienceLevel: profileRow.experience_level,
  yearsExperience: profileRow.years_experience,
  skills: profileRow.skills,
  industries: profileRow.industries,
  workExperience: profileRow.work_experience,
  education: profileRow.education,
  jobTitlesSeeking: profileRow.job_titles_seeking,
})}
`

    let responseText = ''
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
      responseText = response.text || ''
    } catch (modelErr) {
      console.warn('[api/resume/generate] gemini-2.5-flash error, falling back to gemini-flash-latest:', modelErr)
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      })
      responseText = response.text || ''
    }

    if (!responseText) {
      return NextResponse.json(
        { success: false, error: 'AI model returned an empty response.' },
        { status: 500 }
      )
    }

    const aiSynthesized = JSON.parse(responseText)

    const fullResumeContent: ResumeContent = {
      fullName: profileRow.full_name || 'Candidate',
      email: profileRow.email || user.email || '',
      phone: profileRow.phone || '',
      location: profileRow.location || '',
      linkedinUrl: profileRow.linkedin_url || '',
      portfolioUrl: profileRow.portfolio_url || '',
      summary: aiSynthesized.summary || '',
      workExperience: aiSynthesized.workExperience || [],
      skills: aiSynthesized.skills || profileRow.skills || [],
      education: {
        degree: aiSynthesized.education?.degree || profileRow.education?.highestDegree || '',
        field: aiSynthesized.education?.field || profileRow.education?.fieldOfStudy || '',
        institution: aiSynthesized.education?.institution || profileRow.education?.institutionName || '',
        year: aiSynthesized.education?.year || profileRow.education?.graduationYear || '',
      },
    }

    // Render React-PDF template using React.createElement cast to DocumentProps
    const pdfElement = React.createElement(ResumePDF, { data: fullResumeContent }) as unknown as React.ReactElement<DocumentProps>
    const pdfBuffer = await renderToBuffer(pdfElement)
    const pdfBlob = new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' })

    const filePath = `${user.id}/resume.pdf`

    const { error: uploadError } = await insforge.storage
      .from('resumes')
      .upload(filePath, pdfBlob)

    if (uploadError) {
      console.error('[api/resume/generate] upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to save generated resume to storage.' },
        { status: 500 }
      )
    }

    const { data: publicUrlData } = insforge.storage
      .from('resumes')
      .getPublicUrl(filePath)

    const resumeUrl = publicUrlData?.publicUrl || ''

    await insforge.database
      .from('profiles')
      .update({ resume_pdf_url: resumeUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    revalidatePath('/profile')

    return NextResponse.json({
      success: true,
      url: resumeUrl,
    })
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : String(error)
    console.error('[api/resume/generate] error:', errorDetails)
    return NextResponse.json(
      { success: false, error: `Failed to generate resume: ${errorDetails}` },
      { status: 500 }
    )
  }
}
