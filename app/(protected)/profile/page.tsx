import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { ProfileContainer } from '@/components/profile/ProfileContainer'
import { createInsforgeServer } from '@/lib/insforge-server'
import { calculateProfileCompletion, type ProfileData } from '@/lib/profile-utils'

export const metadata: Metadata = {
  title: 'Profile — JobPilot',
  description: 'Manage your profile, upload your resume, and set your job preferences.',
}

export default async function ProfilePage() {
  const insforge = await createInsforgeServer()
  const { data: userData } = await insforge.auth.getCurrentUser()
  const user = userData?.user

  if (!user) {
    redirect('/login')
  }

  const { data: profileRow } = await insforge.database
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const initialProfile: Partial<ProfileData> = profileRow
    ? {
        fullName: profileRow.full_name || '',
        email: profileRow.email || user.email || '',
        phone: profileRow.phone || '',
        location: profileRow.location || '',
        currentTitle: profileRow.current_title || '',
        experienceLevel: profileRow.experience_level || 'junior',
        yearsExperience: profileRow.years_experience?.toString() || '0',
        skills: profileRow.skills || [],
        industries: profileRow.industries || [],
        workRoles: profileRow.work_experience || [],
        education: profileRow.education || {},
        jobTitlesSeeking: profileRow.job_titles_seeking || [],
        remotePreference: profileRow.remote_preference || 'any',
        preferredLocations: Array.isArray(profileRow.preferred_locations)
          ? profileRow.preferred_locations.join(', ')
          : profileRow.preferred_locations || '',
        salaryExpectation: profileRow.salary_expectation || '',
        coverLetterTone: profileRow.cover_letter_tone || 'formal',
        linkedinUrl: profileRow.linkedin_url || '',
        portfolioUrl: profileRow.portfolio_url || '',
        workAuthorization: profileRow.work_authorization || 'citizen',
        resumePdfUrl: profileRow.resume_pdf_url || '',
      }
    : {
        email: user.email || '',
      }

  const { completionPercent, missingFields } = calculateProfileCompletion(initialProfile)

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="mx-auto max-w-[1128px] px-6 py-8">
        <ProfileContainer
          initialProfile={initialProfile}
          userEmail={user.email}
          initialCompletionPercent={completionPercent}
          initialMissingFields={missingFields}
        />
      </main>
    </div>
  )
}
