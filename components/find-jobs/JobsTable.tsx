'use client'

import { Building2, SearchX } from 'lucide-react'
import Link from 'next/link'
import type { JSX } from 'react'
import type { JobListItem } from '@/types/job'

type JobsTableProps = {
  jobs: JobListItem[]
}

function getScoreColorClass(score: number): string {
  if (score >= 90) return 'bg-success'
  if (score >= 80) return 'bg-info-dark'
  return 'bg-warning'
}

export function JobsTable({ jobs }: JobsTableProps): JSX.Element {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface p-12 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-secondary text-text-muted">
          <SearchX size={24} />
        </div>
        <h3 className="mt-4 text-base font-semibold text-text-primary">
          No matching jobs found
        </h3>
        <p className="mt-1 max-w-sm text-sm text-text-secondary">
          Try adjusting your search criteria or changing your match filter to discover more roles.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-surface">
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Company
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Role
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Match Score
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Salary Est.
            </th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Date Found
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {jobs.map((job) => {
            const scoreColor = getScoreColorClass(job.matchScore)

            return (
              <tr
                key={job.id}
                className="group hover:bg-surface-secondary/70 transition-colors"
              >
                {/* Company */}
                <td className="px-6 py-4">
                  <Link
                    href={`/find-jobs/${job.id}`}
                    className="flex items-center gap-3 focus:outline-none"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-secondary text-text-dark group-hover:border-border-muted transition-colors">
                      <Building2 size={16} strokeWidth={1.8} />
                    </div>
                    <span className="text-sm font-bold text-text-primary group-hover:text-accent transition-colors">
                      {job.company}
                    </span>
                  </Link>
                </td>

                {/* Role */}
                <td className="px-6 py-4">
                  <Link
                    href={`/find-jobs/${job.id}`}
                    className="text-sm font-medium text-text-primary group-hover:text-accent transition-colors"
                  >
                    {job.role}
                  </Link>
                </td>

                {/* Match Score */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-20 rounded-full bg-border-light overflow-hidden">
                      <div
                        className={`h-full rounded-full ${scoreColor}`}
                        style={{ width: `${job.matchScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                      {job.matchScore}%
                    </span>
                  </div>
                </td>

                {/* Salary Est. */}
                <td className="px-6 py-4 text-sm font-medium text-text-primary">
                  {job.salary}
                </td>

                {/* Date Found */}
                <td className="px-6 py-4 text-sm font-medium text-text-secondary">
                  {job.dateFound}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
