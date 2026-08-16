'use client'

import { useState, useEffect, type JSX, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, ChevronDown, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { saveProfile } from '@/actions/profile'
import type { ProfileData, WorkRole } from '@/lib/profile-utils'

type Props = {
  initialData?: Partial<ProfileData>
  userEmail?: string
  extractedData?: Partial<ProfileData> | null
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-xs font-medium uppercase tracking-wide text-text-secondary mb-1.5">
      {children}
    </span>
  )
}

function Input({
  id,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
}: {
  id: string
  value: string
  onChange?: (v: string) => void
  placeholder?: string
  type?: string
  disabled?: boolean
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:bg-surface-secondary disabled:text-text-muted transition-colors"
    />
  )
}

function Select({
  id,
  value,
  onChange,
  options,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-border bg-surface px-3 py-2 pr-8 text-sm font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
      />
    </div>
  )
}

function TagInput({
  id,
  tags,
  placeholder,
  onAdd,
  onRemove,
}: {
  id: string
  tags: string[]
  placeholder: string
  onAdd: (tag: string) => void
  onRemove: (tag: string) => void
}) {
  const [input, setInput] = useState('')

  function add() {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onAdd(trimmed)
      setInput('')
    }
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      add()
    }
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          id={id}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-2 rounded-md bg-surface border border-border text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors"
        >
          Add
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-surface-tertiary border border-border text-xs font-medium text-text-dark"
            >
              {tag}
              <button
                type="button"
                onClick={() => onRemove(tag)}
                aria-label={`Remove ${tag}`}
                className="hover:text-error transition-colors"
              >
                <X size={11} strokeWidth={2.5} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

function SectionHeading({ children }: { children: string }) {
  return (
    <h3 className="text-base font-semibold text-text-primary mb-5">{children}</h3>
  )
}

export function ProfileForm({ initialData, userEmail, extractedData }: Props): JSX.Element {
  const [form, setForm] = useState<ProfileData>({
    fullName: initialData?.fullName || '',
    email: userEmail || initialData?.email || '',
    phone: initialData?.phone || '',
    location: initialData?.location || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    portfolioUrl: initialData?.portfolioUrl || '',
    workAuthorization: initialData?.workAuthorization || 'citizen',
    currentTitle: initialData?.currentTitle || '',
    experienceLevel: initialData?.experienceLevel || 'junior',
    yearsExperience: initialData?.yearsExperience?.toString() || '0',
    skills: initialData?.skills || [],
    industries: initialData?.industries || [],
    workRoles: initialData?.workRoles || [],
    education: {
      highestDegree: initialData?.education?.highestDegree || 'bachelor',
      fieldOfStudy: initialData?.education?.fieldOfStudy || '',
      institutionName: initialData?.education?.institutionName || '',
      graduationYear: initialData?.education?.graduationYear || '',
    },
    jobTitlesSeeking: Array.isArray(initialData?.jobTitlesSeeking)
      ? initialData.jobTitlesSeeking.join(', ')
      : initialData?.jobTitlesSeeking || '',
    remotePreference: initialData?.remotePreference || 'any',
    salaryExpectation: initialData?.salaryExpectation || '',
    preferredLocations: initialData?.preferredLocations || '',
    coverLetterTone: initialData?.coverLetterTone || 'formal',
  })

  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  useEffect(() => {
    if (extractedData) {
      setForm((prev) => ({
        ...prev,
        fullName: extractedData.fullName || prev.fullName,
        phone: extractedData.phone || prev.phone,
        location: extractedData.location || prev.location,
        linkedinUrl: extractedData.linkedinUrl || prev.linkedinUrl,
        portfolioUrl: extractedData.portfolioUrl || prev.portfolioUrl,
        workAuthorization: extractedData.workAuthorization || prev.workAuthorization,
        currentTitle: extractedData.currentTitle || prev.currentTitle,
        experienceLevel: extractedData.experienceLevel || prev.experienceLevel,
        yearsExperience: extractedData.yearsExperience?.toString() || prev.yearsExperience,
        skills: extractedData.skills?.length ? extractedData.skills : prev.skills,
        industries: extractedData.industries?.length ? extractedData.industries : prev.industries,
        workRoles: extractedData.workRoles?.length ? extractedData.workRoles : prev.workRoles,
        education: {
          highestDegree: extractedData.education?.highestDegree || prev.education?.highestDegree || 'bachelor',
          fieldOfStudy: extractedData.education?.fieldOfStudy || prev.education?.fieldOfStudy || '',
          institutionName: extractedData.education?.institutionName || prev.education?.institutionName || '',
          graduationYear: extractedData.education?.graduationYear || prev.education?.graduationYear || '',
        },
        jobTitlesSeeking: Array.isArray(extractedData.jobTitlesSeeking)
          ? extractedData.jobTitlesSeeking.join(', ')
          : extractedData.jobTitlesSeeking || prev.jobTitlesSeeking,
        remotePreference: extractedData.remotePreference || prev.remotePreference,
        salaryExpectation: extractedData.salaryExpectation || prev.salaryExpectation,
        preferredLocations: extractedData.preferredLocations || prev.preferredLocations,
        coverLetterTone: extractedData.coverLetterTone || prev.coverLetterTone,
      }))
      setSaveStatus({
        type: 'success',
        message: 'Profile fields extracted from resume! Review below and click Save Profile.',
      })
    }
  }, [extractedData])

  function set<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function addSkill(skill: string) {
    set('skills', [...form.skills, skill])
  }
  function removeSkill(skill: string) {
    set('skills', form.skills.filter((s) => s !== skill))
  }

  function addIndustry(industry: string) {
    set('industries', [...form.industries, industry])
  }
  function removeIndustry(industry: string) {
    set('industries', form.industries.filter((i) => i !== industry))
  }

  function addRole() {
    set('workRoles', [
      ...form.workRoles,
      {
        id: crypto.randomUUID(),
        company: '',
        jobTitle: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        responsibilities: '',
      },
    ])
  }

  function updateRole(id: string, field: keyof WorkRole, value: string | boolean) {
    set(
      'workRoles',
      form.workRoles.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    )
  }

  function removeRole(id: string) {
    set('workRoles', form.workRoles.filter((r) => r.id !== id))
  }

  async function handleSave() {
    setSaving(true)
    setSaveStatus(null)

    const res = await saveProfile(form)

    setSaving(false)
    if (res.success) {
      setSaveStatus({
        type: 'success',
        message: 'Profile saved successfully!',
      })
      router.refresh()
      setTimeout(() => setSaveStatus(null), 4000)
    } else {
      setSaveStatus({
        type: 'error',
        message: res.error || 'Failed to save profile.',
      })
    }
  }

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 border-b border-border-light">
        <h2 className="text-base font-semibold text-text-primary">Profile Information</h2>
        <p className="text-sm font-medium text-text-secondary mt-1">
          This context is used to accurately represent you in agent interactions.
        </p>
      </div>

      <div className="px-8 py-8 space-y-12">
        {/* Personal Info */}
        <section id="section-personal">
          <SectionHeading>Personal Info</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input id="full-name" value={form.fullName} onChange={(v) => set('fullName', v)} placeholder="Your full name" />
            </div>
            <div>
              <Label>Email</Label>
              <Input id="email" value={form.email} disabled />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input id="phone" value={form.phone} onChange={(v) => set('phone', v)} placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <Label>Location</Label>
              <Input id="location" value={form.location} onChange={(v) => set('location', v)} placeholder="City, Country" />
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <Input id="linkedin-url" value={form.linkedinUrl} onChange={(v) => set('linkedinUrl', v)} placeholder="https://linkedin.com/in/username" />
            </div>
            <div>
              <Label>Portfolio / GitHub</Label>
              <Input id="portfolio-url" value={form.portfolioUrl} onChange={(v) => set('portfolioUrl', v)} placeholder="https://github.com/username" />
            </div>
            <div className="md:col-span-1">
              <Label>Work Authorization</Label>
              <Select
                id="work-authorization"
                value={form.workAuthorization}
                onChange={(v) => set('workAuthorization', v)}
                options={[
                  { value: 'citizen', label: 'Citizen' },
                  { value: 'permanent_resident', label: 'Permanent Resident' },
                  { value: 'visa_required', label: 'Visa Required' },
                ]}
              />
            </div>
          </div>
        </section>

        {/* Professional Info */}
        <section id="section-professional">
          <SectionHeading>Professional Info</SectionHeading>
          <div className="space-y-4">
            <div>
              <Label>Current/Recent Job Title</Label>
              <Input id="current-title" value={form.currentTitle} onChange={(v) => set('currentTitle', v)} placeholder="e.g. Frontend Engineer" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Experience Level</Label>
                <Select
                  id="experience-level"
                  value={form.experienceLevel}
                  onChange={(v) => set('experienceLevel', v)}
                  options={[
                    { value: 'junior', label: 'Junior' },
                    { value: 'mid', label: 'Mid' },
                    { value: 'senior', label: 'Senior' },
                    { value: 'lead', label: 'Lead' },
                  ]}
                />
              </div>
              <div>
                <Label>Years of Experience</Label>
                <Input id="years-experience" value={form.yearsExperience} onChange={(v) => set('yearsExperience', v)} placeholder="e.g. 4" type="number" />
              </div>
            </div>
            <div>
              <Label>Skills</Label>
              <TagInput
                id="skills-input"
                tags={form.skills}
                placeholder="Add a skill"
                onAdd={addSkill}
                onRemove={removeSkill}
              />
            </div>
            <div>
              <Label>Industries Worked In (Optional)</Label>
              <TagInput
                id="industries-input"
                tags={form.industries}
                placeholder="E.g. FinTech, Healthcare"
                onAdd={addIndustry}
                onRemove={removeIndustry}
              />
            </div>
          </div>
        </section>

        {/* Work Experience */}
        <section id="section-work-experience">
          <div className="flex items-center justify-between mb-5">
            <SectionHeading>Work Experience</SectionHeading>
            {form.workRoles.length < 3 && (
              <button
                type="button"
                onClick={addRole}
                className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-dark transition-colors"
              >
                <Plus size={14} strokeWidth={2.5} />
                Add role
              </button>
            )}
          </div>
          <div className="space-y-6">
            {form.workRoles.map((role, index) => (
              <div key={role.id} className="border border-border rounded-xl p-5 space-y-4">
                {form.workRoles.length > 1 && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeRole(role.id)}
                      aria-label="Remove role"
                      className="text-text-muted hover:text-error transition-colors"
                    >
                      <X size={15} strokeWidth={2} />
                    </button>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company Name</Label>
                    <Input id={`company-${index}`} value={role.company} onChange={(v) => updateRole(role.id, 'company', v)} placeholder="e.g. Google" />
                  </div>
                  <div>
                    <Label>Job Title</Label>
                    <Input id={`job-title-${index}`} value={role.jobTitle} onChange={(v) => updateRole(role.id, 'jobTitle', v)} placeholder="e.g. Frontend Engineer" />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input id={`start-date-${index}`} type="month" value={role.startDate} onChange={(v) => updateRole(role.id, 'startDate', v)} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <Label>End Date</Label>
                      <label className="flex items-center gap-1.5 cursor-pointer select-none">
                        <input
                          id={`currently-working-${index}`}
                          type="checkbox"
                          checked={role.currentlyWorking}
                          onChange={(e) => updateRole(role.id, 'currentlyWorking', e.target.checked)}
                          className="h-3.5 w-3.5 rounded border-border accent-accent"
                        />
                        <span className="text-xs font-medium text-text-secondary">Currently working here</span>
                      </label>
                    </div>
                    <Input
                      id={`end-date-${index}`}
                      type="month"
                      value={role.endDate}
                      onChange={(v) => updateRole(role.id, 'endDate', v)}
                      disabled={role.currentlyWorking}
                      placeholder="Present"
                    />
                  </div>
                </div>
                <div>
                  <Label>Key Responsibilities</Label>
                  <textarea
                    id={`responsibilities-${index}`}
                    value={role.responsibilities}
                    onChange={(e) => updateRole(role.id, 'responsibilities', e.target.value)}
                    placeholder="Describe your key responsibilities and achievements..."
                    rows={3}
                    className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent resize-none transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section id="section-education">
          <SectionHeading>Education</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Highest Degree</Label>
              <Select
                id="highest-degree"
                value={form.education.highestDegree}
                onChange={(v) => set('education', { ...form.education, highestDegree: v })}
                options={[
                  { value: 'high-school', label: 'High School' },
                  { value: 'associate', label: 'Associate' },
                  { value: 'bachelor', label: "Bachelor's" },
                  { value: 'master', label: "Master's" },
                  { value: 'phd', label: 'PhD' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </div>
            <div>
              <Label>Field of Study</Label>
              <Input
                id="field-of-study"
                value={form.education.fieldOfStudy}
                onChange={(v) => set('education', { ...form.education, fieldOfStudy: v })}
                placeholder="e.g. Computer Science"
              />
            </div>
            <div>
              <Label>Institution Name</Label>
              <Input
                id="institution-name"
                value={form.education.institutionName}
                onChange={(v) => set('education', { ...form.education, institutionName: v })}
                placeholder="E.g. State University"
              />
            </div>
            <div>
              <Label>Graduation Year</Label>
              <Input
                id="graduation-year"
                value={form.education.graduationYear}
                onChange={(v) => set('education', { ...form.education, graduationYear: v })}
                placeholder="YYYY"
              />
            </div>
          </div>
        </section>

        {/* Job Preferences */}
        <section id="section-preferences">
          <SectionHeading>Job Preferences</SectionHeading>
          <div className="space-y-4">
            <div>
              <Label>Job Titles Seeking</Label>
              <Input
                id="job-titles-seeking"
                value={form.jobTitlesSeeking as string}
                onChange={(v) => set('jobTitlesSeeking', v)}
                placeholder="e.g. Frontend Engineer, React Developer"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Remote Preference</Label>
                <Select
                  id="remote-preference"
                  value={form.remotePreference}
                  onChange={(v) => set('remotePreference', v)}
                  options={[
                    { value: 'any', label: 'Any' },
                    { value: 'remote', label: 'Remote' },
                    { value: 'hybrid', label: 'Hybrid' },
                    { value: 'onsite', label: 'On-site' },
                  ]}
                />
              </div>
              <div>
                <Label>Salary Expectation (Optional)</Label>
                <Input
                  id="salary-expectation"
                  value={form.salaryExpectation}
                  onChange={(v) => set('salaryExpectation', v)}
                  placeholder="E.g. $120k+"
                />
              </div>
            </div>
            <div>
              <Label>Preferred Locations (Optional)</Label>
              <Input
                id="preferred-locations"
                value={form.preferredLocations}
                onChange={(v) => set('preferredLocations', v)}
                placeholder="E.g. New York, London"
              />
            </div>
          </div>
        </section>
      </div>

      {/* Feedback Alert */}
      {saveStatus && (
        <div
          className={`mx-8 mb-4 p-3 rounded-md border flex items-center gap-2 text-sm font-medium ${
            saveStatus.type === 'success'
              ? 'bg-success-lightest border-success-alt text-success-foreground'
              : 'bg-error-light border-error text-error-foreground'
          }`}
        >
          {saveStatus.type === 'success' ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {saveStatus.message}
        </div>
      )}

      {/* Save button */}
      <div className="px-8 py-6 border-t border-border-light">
        <button
          type="button"
          id="save-profile-btn"
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 rounded-md bg-accent py-3 text-sm font-semibold text-accent-foreground hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving Profile...
            </>
          ) : (
            'Save Profile'
          )}
        </button>
      </div>
    </div>
  )
}
