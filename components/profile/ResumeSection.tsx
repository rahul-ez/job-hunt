'use client'

import { useRef, useState, type JSX } from 'react'
import { useRouter } from 'next/navigation'
import { CloudUpload, FileText, Loader2, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react'
import { uploadResumeAction } from '@/actions/profile'
import type { ProfileData } from '@/lib/profile-utils'

type Props = {
  resumeUrl?: string
  onExtractSuccess?: (data: Partial<ProfileData>) => void
}

export function ResumeSection({ resumeUrl: initialResumeUrl, onExtractSuccess }: Props): JSX.Element {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [resumeUrl, setResumeUrl] = useState<string | undefined>(initialResumeUrl)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [lastUploadedFile, setLastUploadedFile] = useState<File | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [extractSuccessMsg, setExtractSuccessMsg] = useState<string | null>(null)

  async function handleExtract(file?: File | null) {
    const targetFile = file || lastUploadedFile
    if (!targetFile && !resumeUrl) {
      setErrorMsg('Please upload a resume first.')
      return
    }

    setExtracting(true)
    setErrorMsg(null)
    setExtractSuccessMsg(null)

    try {
      const formData = new FormData()
      if (targetFile) {
        formData.append('resume', targetFile)
      } else if (resumeUrl) {
        formData.append('resumeUrl', resumeUrl)
      }

      const response = await fetch('/api/resume/extract', {
        method: 'POST',
        body: formData,
      })

      const res = await response.json()
      setExtracting(false)

      if (res.success && res.data) {
        onExtractSuccess?.(res.data)
        setExtractSuccessMsg('Profile fields extracted! Review the form below before saving.')
        setTimeout(() => setExtractSuccessMsg(null), 6000)
      } else {
        setErrorMsg(res.error || 'Could not extract profile data from resume.')
      }
    } catch (err) {
      setExtracting(false)
      console.error('[ResumeSection] extract error:', err)
      setErrorMsg('Failed to extract data from resume.')
    }
  }

  async function handleGenerateResume() {
    setGenerating(true)
    setErrorMsg(null)
    setExtractSuccessMsg(null)

    try {
      const response = await fetch('/api/resume/generate', {
        method: 'POST',
      })
      const res = await response.json()
      setGenerating(false)

      if (res.success && res.url) {
        setResumeUrl(res.url)
        router.refresh()
        setExtractSuccessMsg('Generated fresh resume PDF from your profile!')
        setTimeout(() => setExtractSuccessMsg(null), 6000)
      } else {
        setErrorMsg(res.error || 'Failed to generate resume PDF.')
      }
    } catch (err) {
      setGenerating(false)
      console.error('[ResumeSection] generate error:', err)
      setErrorMsg('Failed to generate resume.')
    }
  }

  async function handleFile(file: File) {
    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are supported.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds maximum 5MB limit.')
      return
    }

    setErrorMsg(null)
    setUploading(true)
    setUploadedFileName(file.name)
    setLastUploadedFile(file)

    const formData = new FormData()
    formData.append('resume', file)

    const res = await uploadResumeAction(formData)
    setUploading(false)

    if (res.success && res.url) {
      setResumeUrl(res.url)
      router.refresh()
    } else {
      setErrorMsg(res.error || 'Failed to upload resume.')
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const hasResume = Boolean(resumeUrl || lastUploadedFile)

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-text-primary mb-1">Resume</h2>
      <p className="text-sm font-medium text-text-secondary mb-5">
        Upload an existing resume to auto-fill the profile, or generate a new tailored one from
        your details below.
      </p>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center py-10 px-6 transition-colors cursor-pointer ${
          isDragging
            ? 'border-accent bg-accent-muted'
            : 'border-border bg-surface-secondary hover:border-accent hover:bg-accent-muted'
        }`}
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label="Upload resume PDF"
      >
        <input
          ref={inputRef}
          id="resume-upload"
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) handleFile(file)
          }}
        />

        {uploading ? (
          <>
            <Loader2 size={32} className="text-accent animate-spin mb-3" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-text-primary">Uploading resume...</p>
            <p className="text-xs font-medium text-text-muted mt-1">{uploadedFileName}</p>
          </>
        ) : resumeUrl ? (
          <>
            <CheckCircle2 size={32} className="text-success mb-3" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-text-primary">Active Resume Uploaded</p>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-accent hover:underline cursor-pointer"
            >
              <span>View uploaded PDF</span>
              <ExternalLink size={12} />
            </a>
          </>
        ) : (
          <>
            <CloudUpload size={32} className="text-accent mb-3" strokeWidth={1.5} />
            <p className="text-sm font-semibold text-text-primary">Click to upload or drag and drop</p>
            <p className="text-xs font-medium text-text-muted mt-1">
              PDF formatting only. Maximum file size 5MB.
            </p>
          </>
        )}
      </div>

      {errorMsg && (
        <p className="text-xs font-medium text-error mt-2">{errorMsg}</p>
      )}

      {extractSuccessMsg && (
        <p className="text-xs font-medium text-success mt-2 flex items-center gap-1">
          <CheckCircle2 size={14} />
          {extractSuccessMsg}
        </p>
      )}

      {/* Action row */}
      <div className="flex items-center justify-between mt-4 gap-3">
        <button
          type="button"
          disabled={uploading || extracting || generating}
          onClick={() => inputRef.current?.click()}
          className="px-4 py-2 rounded-md border border-border bg-surface text-sm font-medium text-text-primary hover:bg-surface-secondary transition-colors disabled:opacity-50"
        >
          {resumeUrl ? 'Replace Resume' : 'Select Resume'}
        </button>

        {hasResume && (
          <button
            type="button"
            disabled={extracting || uploading || generating}
            onClick={() => handleExtract()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-accent-light text-accent text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
          >
            {extracting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Extracting Profile...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Extract from Resume
              </>
            )}
          </button>
        )}
      </div>

      {/* Generate resume row */}
      <div className="flex items-center justify-between mt-5 pt-5 border-t border-border-light">
        <p className="text-sm font-medium text-text-secondary">
          Need a fresh document based on the fields below?
        </p>
        <button
          type="button"
          disabled={generating || uploading || extracting}
          onClick={handleGenerateResume}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground text-sm font-medium hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Generating Resume...
            </>
          ) : (
            <>
              <FileText size={14} strokeWidth={2} />
              Generate Resume from Profile
            </>
          )}
        </button>
      </div>
    </div>
  )
}
