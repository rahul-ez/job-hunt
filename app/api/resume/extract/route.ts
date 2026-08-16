import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createInsforgeServer } from '@/lib/insforge-server'

export async function POST(req: NextRequest) {
  try {
    const insforge = await createInsforgeServer()
    const { data: userData, error: userError } = await insforge.auth.getCurrentUser()

    if (userError || !userData?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in.' },
        { status: 401 }
      )
    }

    let pdfBase64 = ''

    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('resume') as File | null
      const resumeUrl = formData.get('resumeUrl') as string | null

      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer()
        pdfBase64 = Buffer.from(arrayBuffer).toString('base64')
      } else if (resumeUrl && resumeUrl.trim()) {
        const fetchRes = await fetch(resumeUrl)
        if (!fetchRes.ok) {
          return NextResponse.json(
            { success: false, error: 'Could not fetch uploaded resume PDF.' },
            { status: 400 }
          )
        }
        const arrayBuffer = await fetchRes.arrayBuffer()
        pdfBase64 = Buffer.from(arrayBuffer).toString('base64')
      }
    } else {
      const body = await req.json().catch(() => ({}))
      if (body.resumeUrl) {
        const fetchRes = await fetch(body.resumeUrl)
        if (!fetchRes.ok) {
          return NextResponse.json(
            { success: false, error: 'Could not fetch uploaded resume PDF.' },
            { status: 400 }
          )
        }
        const arrayBuffer = await fetchRes.arrayBuffer()
        pdfBase64 = Buffer.from(arrayBuffer).toString('base64')
      }
    }

    // Clean whitespace/newlines from base64 string
    pdfBase64 = pdfBase64.replace(/[\r\n\s]/g, '')

    if (!pdfBase64) {
      return NextResponse.json(
        { success: false, error: 'No valid resume PDF provided.' },
        { status: 400 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('[api/resume/extract] GEMINI_API_KEY is not defined in environment.')
      return NextResponse.json(
        { success: false, error: 'Gemini API key not configured.' },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey })

    const prompt = `You are an expert resume parsing assistant. Carefully analyze the attached resume PDF document and extract structured candidate profile information.

Return ONLY a valid JSON object matching this exact shape:
{
  "fullName": "string",
  "phone": "string",
  "location": "string",
  "linkedinUrl": "string",
  "portfolioUrl": "string",
  "workAuthorization": "citizen" | "permanent_resident" | "visa_required",
  "currentTitle": "string",
  "experienceLevel": "junior" | "mid" | "senior" | "lead",
  "yearsExperience": "string",
  "skills": ["string"],
  "industries": ["string"],
  "workRoles": [
    {
      "id": "string",
      "company": "string",
      "jobTitle": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM",
      "currentlyWorking": boolean,
      "responsibilities": "string"
    }
  ],
  "education": {
    "highestDegree": "high-school" | "associate" | "bachelor" | "master" | "phd" | "other",
    "fieldOfStudy": "string",
    "institutionName": "string",
    "graduationYear": "string"
  },
  "jobTitlesSeeking": "string",
  "remotePreference": "remote" | "onsite" | "hybrid" | "any",
  "salaryExpectation": "string",
  "preferredLocations": "string",
  "coverLetterTone": "formal" | "casual" | "enthusiastic"
}

Formatting guidelines:
- Work roles must have unique string ids. Limit to the 3 most recent roles max.
- Dates should be YYYY-MM if available or empty string "".
- Empty or unmentioned fields should be empty string "" or empty array [].
- Infer reasonable defaults for enum fields based on content if not explicitly stated.`

    let responseText = ''
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: pdfBase64,
            },
          },
          prompt,
        ],
        config: {
          responseMimeType: 'application/json',
        },
      })
      responseText = response.text || ''
    } catch (modelErr) {
      console.warn('[api/resume/extract] gemini-2.5-flash error, falling back to gemini-flash-latest:', modelErr)
      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: pdfBase64,
            },
          },
          prompt,
        ],
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

    const extractedData = JSON.parse(responseText)

    return NextResponse.json({
      success: true,
      data: extractedData,
    })
  } catch (error) {
    const errorDetails = error instanceof Error ? error.message : String(error)
    console.error('[api/resume/extract] error details:', errorDetails)
    return NextResponse.json(
      { success: false, error: `Extraction error: ${errorDetails}` },
      { status: 500 }
    )
  }
}
