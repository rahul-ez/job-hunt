import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { AppNavbar } from '@/components/layout/AppNavbar'
import { FindJobsContainer } from '@/components/find-jobs/FindJobsContainer'
import { createInsforgeServer } from '@/lib/insforge-server'
import { formatTimeAgo } from '@/lib/utils'
import type { JobListItem } from '@/types/job'

export const metadata: Metadata = {
  title: 'Find Jobs — JobPilot',
  description: 'Search and discover personalized job matches with AI scoring.',
}

export default async function FindJobsPage() {
  const insforge = await createInsforgeServer()
  const { data: userData } = await insforge.auth.getCurrentUser()
  const user = userData?.user

  if (!user) {
    redirect('/login')
  }

  const { data: jobsRows } = await insforge.database
    .from('jobs')
    .select('id, company, title, match_score, salary, found_at, location, source')
    .eq('user_id', user.id)
    .order('found_at', { ascending: false })

  const initialJobs: JobListItem[] = (jobsRows || []).map((row) => ({
    id: row.id,
    company: row.company,
    role: row.title,
    matchScore: row.match_score || 0,
    salary: row.salary || 'Salary undisclosed',
    dateFound: formatTimeAgo(row.found_at),
    foundAt: row.found_at,
    location: row.location,
    source: (row.source as 'search' | 'url') || 'search',
  }))

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />

      <main className="mx-auto max-w-[1128px] px-6 py-8">
        <FindJobsContainer initialJobs={initialJobs} />
      </main>
    </div>
  )
}
