'use client'

import { ChevronDown, Search } from 'lucide-react'
import type { JSX } from 'react'
import type { MatchFilterOption, SortOption } from '@/types/job'

type JobFiltersProps = {
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  matchFilter: MatchFilterOption
  onMatchFilterChange: (filter: MatchFilterOption) => void
  sortBy: SortOption
  onSortByChange: (sort: SortOption) => void
}

export function JobFilters({
  searchQuery,
  onSearchQueryChange,
  matchFilter,
  onMatchFilterChange,
  sortBy,
  onSortByChange,
}: JobFiltersProps): JSX.Element {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Search Input */}
      <div className="relative flex flex-1 items-center max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 text-text-muted"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Filter by company or role..."
          className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-3 text-sm font-medium text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors"
        />
      </div>

      {/* Filter and Sort Dropdowns */}
      <div className="flex items-center gap-3">
        {/* Match Filter */}
        <div className="relative">
          <select
            value={matchFilter}
            onChange={(e) => onMatchFilterChange(e.target.value as MatchFilterOption)}
            aria-label="Filter matches"
            className="h-11 appearance-none rounded-xl border border-border bg-surface pl-4 pr-9 text-sm font-medium text-text-primary hover:bg-surface-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors cursor-pointer"
          >
            <option value="all">All Matches</option>
            <option value="high">High Match (70%+)</option>
            <option value="low">Low Match (&lt;70%)</option>
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
        </div>

        {/* Sort By */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            aria-label="Sort jobs by"
            className="h-11 appearance-none rounded-xl border border-border bg-surface pl-4 pr-9 text-sm font-medium text-text-primary hover:bg-surface-secondary focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent transition-colors cursor-pointer"
          >
            <option value="match">Match Score</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          <ChevronDown
            size={15}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
        </div>
      </div>
    </div>
  )
}
