export type WorkRole = {
  id: string
  company: string
  jobTitle: string
  startDate: string
  endDate: string
  currentlyWorking: boolean
  responsibilities: string
}

export type EducationInfo = {
  highestDegree: string
  fieldOfStudy: string
  institutionName: string
  graduationYear: string
}

export type ProfileData = {
  id?: string
  fullName: string
  email: string
  phone: string
  location: string
  linkedinUrl: string
  portfolioUrl: string
  workAuthorization: string
  currentTitle: string
  experienceLevel: string
  yearsExperience: string
  skills: string[]
  industries: string[]
  workRoles: WorkRole[]
  education: EducationInfo
  jobTitlesSeeking: string[] | string
  remotePreference: string
  salaryExpectation: string
  preferredLocations: string
  coverLetterTone: string
  resumePdfUrl?: string
  isComplete?: boolean
}

export function calculateProfileCompletion(profile: Partial<ProfileData>): {
  completionPercent: number
  missingFields: string[]
  isComplete: boolean
} {
  const missingFields: string[] = []

  if (!profile.fullName?.trim()) missingFields.push('FULL NAME')
  if (!profile.phone?.trim()) missingFields.push('PHONE')
  if (!profile.location?.trim()) missingFields.push('LOCATION')
  if (!profile.currentTitle?.trim()) missingFields.push('CURRENT TITLE')
  const hasExperience = (Number(profile.yearsExperience) > 0) || (profile.workRoles && profile.workRoles.length > 0)
  if (!hasExperience) missingFields.push('EXPERIENCE')
  if (!profile.skills || profile.skills.length === 0) missingFields.push('SKILLS')
  
  const seeking = Array.isArray(profile.jobTitlesSeeking)
    ? profile.jobTitlesSeeking.join(', ')
    : profile.jobTitlesSeeking || ''
  if (!seeking.trim()) missingFields.push('SEEKING ROLES')

  const edu = profile.education
  if (!edu?.highestDegree || !edu?.fieldOfStudy?.trim()) missingFields.push('EDUCATION')

  const totalFields = 8
  const completedCount = totalFields - missingFields.length
  const completionPercent = Math.max(0, Math.min(100, Math.round((completedCount / totalFields) * 100)))
  const isComplete = missingFields.length === 0

  return {
    completionPercent,
    missingFields,
    isComplete,
  }
}
