export type MatchFilterOption = 'all' | 'high' | 'low'
export type SortOption = 'match' | 'newest' | 'oldest'

export type JobListItem = {
  id: string
  company: string
  role: string
  matchScore: number
  salary: string
  dateFound: string
  foundAt?: string
  location?: string
  source?: 'search' | 'url'
}
