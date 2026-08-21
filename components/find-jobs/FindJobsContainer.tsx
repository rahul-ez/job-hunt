'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { JSX } from 'react'
import { SearchControls } from '@/components/find-jobs/SearchControls'
import { JobFilters } from '@/components/find-jobs/JobFilters'
import { JobsTable } from '@/components/find-jobs/JobsTable'
import { JobsPagination } from '@/components/find-jobs/JobsPagination'
import { formatTimeAgo, MATCH_THRESHOLD } from '@/lib/utils'
import type { JobListItem, MatchFilterOption, SortOption } from '@/types/job'

const now = Date.now()
const MOCK_JOBS: JobListItem[] = [
  {
    id: 'mock-1',
    company: 'Vercel',
    role: 'Senior Frontend Engineer',
    matchScore: 94,
    salary: '$160k - $200k',
    dateFound: '2 hours ago',
    foundAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    location: 'Remote, US',
    source: 'search',
  },
  {
    id: 'mock-2',
    company: 'Stripe',
    role: 'Staff UI Engineer',
    matchScore: 88,
    salary: '$180k - $240k',
    dateFound: 'Yesterday',
    foundAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
    location: 'San Francisco, CA',
    source: 'search',
  },
  {
    id: 'mock-3',
    company: 'Linear',
    role: 'Product Engineer',
    matchScore: 96,
    salary: '$150k - $190k',
    dateFound: 'Yesterday',
    foundAt: new Date(now - 26 * 60 * 60 * 1000).toISOString(),
    location: 'Remote, Global',
    source: 'search',
  },
  {
    id: 'mock-4',
    company: 'Notion',
    role: 'Frontend Developer',
    matchScore: 72,
    salary: '$130k - $170k',
    dateFound: '2 days ago',
    foundAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'New York, NY',
    source: 'search',
  },
  {
    id: 'mock-5',
    company: 'OpenAI',
    role: 'Design Engineer',
    matchScore: 91,
    salary: '$200k - $280k',
    dateFound: '3 days ago',
    foundAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'San Francisco, CA',
    source: 'search',
  },
  {
    id: 'mock-6',
    company: 'Figma',
    role: 'Software Engineer, Editor',
    matchScore: 85,
    salary: '$170k - $220k',
    dateFound: '4 days ago',
    foundAt: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Remote, US',
    source: 'search',
  },
  {
    id: 'mock-7',
    company: 'Supabase',
    role: 'Senior Full Stack Engineer',
    matchScore: 93,
    salary: '$160k - $205k',
    dateFound: '4 days ago',
    foundAt: new Date(now - 4 * 24 * 60 * 60 * 1000 - 3600000).toISOString(),
    location: 'Remote, Global',
    source: 'search',
  },
  {
    id: 'mock-8',
    company: 'GitHub',
    role: 'Frontend Platform Engineer',
    matchScore: 87,
    salary: '$155k - $195k',
    dateFound: '5 days ago',
    foundAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Remote, US',
    source: 'search',
  },
  {
    id: 'mock-9',
    company: 'Anthropic',
    role: 'Frontend Infrastructure Lead',
    matchScore: 95,
    salary: '$210k - $290k',
    dateFound: '5 days ago',
    foundAt: new Date(now - 5 * 24 * 60 * 60 * 1000 - 7200000).toISOString(),
    location: 'San Francisco, CA',
    source: 'search',
  },
  {
    id: 'mock-10',
    company: 'Datadog',
    role: 'Senior UI/UX Engineer',
    matchScore: 78,
    salary: '$140k - $180k',
    dateFound: '6 days ago',
    foundAt: new Date(now - 6 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'New York, NY',
    source: 'search',
  },
  {
    id: 'mock-11',
    company: 'Ramp',
    role: 'Full Stack Product Engineer',
    matchScore: 90,
    salary: '$175k - $225k',
    dateFound: '1 week ago',
    foundAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'New York, NY',
    source: 'search',
  },
  {
    id: 'mock-12',
    company: 'Retool',
    role: 'Frontend Core Engineer',
    matchScore: 82,
    salary: '$150k - $190k',
    dateFound: '1 week ago',
    foundAt: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'San Francisco, CA',
    source: 'search',
  },
]

const PAGE_SIZE = 6

type FindJobsContainerProps = {
  initialJobs?: JobListItem[]
}

export function FindJobsContainer({ initialJobs }: FindJobsContainerProps): JSX.Element {
  const router = useRouter()
  const [jobTitle, setJobTitle] = useState('Frontend Engineer')
  const [location, setLocation] = useState('Remote, New York...')
  const [isSearching, setIsSearching] = useState(false)
  const [searchFeedback, setSearchFeedback] = useState<string | null>(
    initialJobs && initialJobs.length > 0
      ? `Displaying ${initialJobs.length} saved jobs.`
      : 'Found 8 jobs and saved 4 strong matches.',
  )

  const [jobs, setJobs] = useState<JobListItem[]>(
    initialJobs && initialJobs.length > 0 ? initialJobs : MOCK_JOBS,
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [matchFilter, setMatchFilter] = useState<MatchFilterOption>('all')
  const [sortBy, setSortBy] = useState<SortOption>('match')
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearch = async () => {
    if (!jobTitle.trim()) return

    setIsSearching(true)
    setSearchFeedback(null)

    try {
      const res = await fetch('/api/agent/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: jobTitle.trim(),
          location: location.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setSearchFeedback(data.error || 'Failed to discover jobs. Please try again.')
        return
      }

      setSearchFeedback(
        data.message ||
          `Found ${data.count} jobs and saved ${data.strongMatchesCount} strong matches.`,
      )

      if (data.jobs && Array.isArray(data.jobs)) {
        type RawSavedJob = {
          id: string
          company: string
          title: string
          match_score?: number
          salary?: string | null
          found_at: string
          location?: string
        }

        const formattedNewJobs: JobListItem[] = data.jobs.map((j: RawSavedJob) => ({
          id: j.id,
          company: j.company,
          role: j.title,
          matchScore: j.match_score || 0,
          salary: j.salary || 'Salary undisclosed',
          dateFound: formatTimeAgo(j.found_at),
          foundAt: j.found_at,
          location: j.location,
          source: 'search',
        }))
        setJobs(formattedNewJobs)
        setCurrentPage(1)
      }

      router.refresh()
    } catch (err) {
      console.error('[FindJobsContainer] Search error:', err)
      setSearchFeedback('Unable to connect to job search service. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    let result = [...jobs]

    // 1. Text filter across company, role, and location
    if (searchQuery.trim()) {
      const terms = searchQuery.toLowerCase().split(/\s+/).filter(Boolean)
      result = result.filter((job) => {
        const comp = job.company.toLowerCase()
        const role = job.role.toLowerCase()
        const loc = (job.location || '').toLowerCase()
        return terms.every(
          (term) => comp.includes(term) || role.includes(term) || loc.includes(term),
        )
      })
    }

    // 2. Match score filter
    if (matchFilter === 'high') {
      result = result.filter((job) => job.matchScore >= MATCH_THRESHOLD)
    } else if (matchFilter === 'low') {
      result = result.filter((job) => job.matchScore < MATCH_THRESHOLD)
    }

    // 3. Sorting
    if (sortBy === 'match') {
      result.sort((a, b) => b.matchScore - a.matchScore)
    } else if (sortBy === 'newest') {
      result.sort((a, b) => {
        const timeA = a.foundAt ? new Date(a.foundAt).getTime() : 0
        const timeB = b.foundAt ? new Date(b.foundAt).getTime() : 0
        return timeB - timeA
      })
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => {
        const timeA = a.foundAt ? new Date(a.foundAt).getTime() : 0
        const timeB = b.foundAt ? new Date(b.foundAt).getTime() : 0
        return timeA - timeB
      })
    }

    return result
  }, [jobs, searchQuery, matchFilter, sortBy])

  // Total pages
  const totalResults = filteredAndSortedJobs.length
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE))

  // Paginated items
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredAndSortedJobs.slice(start, start + PAGE_SIZE)
  }, [filteredAndSortedJobs, currentPage])

  // Reset to page 1 on filter or sort change
  const handleMatchFilterChange = (filter: MatchFilterOption) => {
    setMatchFilter(filter)
    setCurrentPage(1)
  }

  const handleSortByChange = (sort: SortOption) => {
    setSortBy(sort)
    setCurrentPage(1)
  }

  const handleSearchQueryChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6">
      {/* Search Controls Card */}
      <SearchControls
        jobTitle={jobTitle}
        location={location}
        onJobTitleChange={setJobTitle}
        onLocationChange={setLocation}
        onSearch={handleSearch}
        isSearching={isSearching}
        searchFeedback={searchFeedback}
      />

      {/* Filter and Search Bar */}
      <JobFilters
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        matchFilter={matchFilter}
        onMatchFilterChange={handleMatchFilterChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
      />

      {/* Jobs Table */}
      <JobsTable jobs={paginatedJobs} />

      {/* Pagination */}
      {totalResults > 0 && (
        <JobsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalResults={totalResults}
          pageSize={PAGE_SIZE}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
