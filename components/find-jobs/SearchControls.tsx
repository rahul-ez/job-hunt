'use client'

import { Search, Sparkles } from 'lucide-react'
import type { JSX } from 'react'

type SearchControlsProps = {
  jobTitle: string
  location: string
  onJobTitleChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSearch: () => void
  isSearching?: boolean
  searchFeedback?: string | null
}

export function SearchControls({
  jobTitle,
  location,
  onJobTitleChange,
  onLocationChange,
  onSearch,
  isSearching = false,
  searchFeedback = 'Found 8 jobs and saved 4 strong matches.',
}: SearchControlsProps): JSX.Element {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        {/* Job Title Field */}
        <div className="flex-1">
          <label
            htmlFor="job-title-input"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-dark"
          >
            Job Title
          </label>
          <div className="relative flex items-center">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 text-text-muted"
            />
            <input
              id="job-title-input"
              type="text"
              value={jobTitle}
              onChange={(e) => onJobTitleChange(e.target.value)}
              placeholder="Frontend Engineer"
              className="h-11 w-full rounded-lg border border-border bg-surface pl-10 pr-3 text-sm font-medium text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
        </div>

        {/* Location Field */}
        <div className="flex-1">
          <label
            htmlFor="location-input"
            className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-dark"
          >
            Location
          </label>
          <div className="relative flex items-center">
            <input
              id="location-input"
              type="text"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              placeholder="Remote, New York..."
              className="h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm font-medium text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
        </div>

        {/* Find Jobs Button */}
        <div>
          <button
            type="button"
            onClick={onSearch}
            disabled={isSearching}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 text-sm font-medium text-accent-foreground shadow-sm hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 transition-colors md:w-auto"
          >
            <Search size={16} strokeWidth={2.2} />
            <span>{isSearching ? 'Finding Jobs...' : 'Find Jobs'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {searchFeedback && (
        <div className="mt-5 flex items-center gap-2.5 rounded-lg border border-success-light/70 bg-success-lightest px-4 py-3 text-sm font-medium text-success-dark">
          <Sparkles size={16} className="shrink-0 text-success" />
          <span>{searchFeedback}</span>
        </div>
      )}
    </div>
  )
}
