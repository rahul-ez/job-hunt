'use client'

import { useState } from 'react'
import { ProfileBanner } from '@/components/profile/ProfileBanner'
import { ResumeSection } from '@/components/profile/ResumeSection'
import { ProfileForm } from '@/components/profile/ProfileForm'
import type { ProfileData } from '@/lib/profile-utils'

type Props = {
  initialProfile: Partial<ProfileData>
  userEmail?: string
  initialCompletionPercent: number
  initialMissingFields: string[]
}

export function ProfileContainer({
  initialProfile,
  userEmail,
  initialCompletionPercent,
  initialMissingFields,
}: Props) {
  const [extractedData, setExtractedData] = useState<Partial<ProfileData> | null>(null)

  return (
    <div className="max-w-[720px] mx-auto space-y-6">
      <ProfileBanner
        completionPercent={initialCompletionPercent}
        missingFields={initialMissingFields}
      />
      <ResumeSection
        resumeUrl={initialProfile.resumePdfUrl}
        onExtractSuccess={(data) => setExtractedData(data)}
      />
      <ProfileForm
        initialData={initialProfile}
        userEmail={userEmail}
        extractedData={extractedData}
      />
    </div>
  )
}
