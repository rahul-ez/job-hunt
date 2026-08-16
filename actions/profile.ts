'use server'

import { revalidatePath } from 'next/cache'
import { createInsforgeServer } from '@/lib/insforge-server'
import { calculateProfileCompletion, type ProfileData } from '@/lib/profile-utils'

export async function saveProfile(data: ProfileData) {
  try {
    const insforge = await createInsforgeServer()
    const { data: userData, error: userError } = await insforge.auth.getCurrentUser()
    const user = userData?.user

    if (userError || !user) {
      return { success: false, error: 'Unauthorized. Please log in.' }
    }

    const { completionPercent, missingFields, isComplete } = calculateProfileCompletion(data)

    const jobTitlesArray = typeof data.jobTitlesSeeking === 'string'
      ? data.jobTitlesSeeking.split(',').map((s) => s.trim()).filter(Boolean)
      : data.jobTitlesSeeking || []

    const preferredLocationsArray = typeof data.preferredLocations === 'string'
      ? data.preferredLocations.split(',').map((s) => s.trim()).filter(Boolean)
      : data.preferredLocations || []

    const profileRecord = {
      id: user.id,
      full_name: data.fullName,
      email: data.email || user.email,
      phone: data.phone || '',
      location: data.location || '',
      current_title: data.currentTitle || '',
      experience_level: data.experienceLevel || 'junior',
      years_experience: Number(data.yearsExperience) || 0,
      skills: data.skills || [],
      industries: data.industries || [],
      work_experience: data.workRoles || [],
      education: data.education || {},
      job_titles_seeking: jobTitlesArray,
      remote_preference: data.remotePreference || 'any',
      preferred_locations: preferredLocationsArray,
      salary_expectation: data.salaryExpectation || '',
      cover_letter_tone: data.coverLetterTone || 'formal',
      linkedin_url: data.linkedinUrl || '',
      portfolio_url: data.portfolioUrl || '',
      work_authorization: data.workAuthorization || 'citizen',
      is_complete: isComplete,
      updated_at: new Date().toISOString(),
    }

    const { error: upsertError } = await insforge.database
      .from('profiles')
      .upsert([profileRecord])

    if (upsertError) {
      console.error('[actions/profile] saveProfile error:', upsertError)
      return { success: false, error: 'Failed to save profile. Please try again.' }
    }

    revalidatePath('/profile')
    revalidatePath('/dashboard')

    return {
      success: true,
      completionPercent,
      missingFields,
    }
  } catch (error) {
    console.error('[actions/profile] saveProfile caught error:', error)
    return { success: false, error: 'An unexpected error occurred while saving.' }
  }
}

export async function uploadResumeAction(formData: FormData) {
  try {
    const insforge = await createInsforgeServer()
    const { data: userData, error: userError } = await insforge.auth.getCurrentUser()
    const user = userData?.user

    if (userError || !user) {
      return { success: false, error: 'Unauthorized. Please log in.' }
    }

    const file = formData.get('resume') as File
    if (!file) {
      return { success: false, error: 'No file provided.' }
    }

    if (file.type !== 'application/pdf') {
      return { success: false, error: 'Only PDF files are supported.' }
    }

    const arrayBuffer = await file.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' })
    const filePath = `${user.id}/resume.pdf`

    const { error: uploadError } = await insforge.storage
      .from('resumes')
      .upload(filePath, blob)

    if (uploadError) {
      console.error('[actions/profile] uploadResumeAction error:', uploadError)
      return { success: false, error: 'Failed to upload resume to storage.' }
    }

    const { data: publicUrlData } = insforge.storage
      .from('resumes')
      .getPublicUrl(filePath)

    const resumeUrl = publicUrlData?.publicUrl || ''

    const { error: updateError } = await insforge.database
      .from('profiles')
      .update({ resume_pdf_url: resumeUrl, updated_at: new Date().toISOString() })
      .eq('id', user.id)

    if (updateError) {
      console.error('[actions/profile] update profile resume_pdf_url error:', updateError)
    }

    revalidatePath('/profile')

    return { success: true, url: resumeUrl, fileName: file.name }
  } catch (error) {
    console.error('[actions/profile] uploadResumeAction caught error:', error)
    return { success: false, error: 'Failed to upload resume.' }
  }
}
