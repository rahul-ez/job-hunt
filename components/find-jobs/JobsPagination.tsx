'use client'

import type { JSX } from 'react'

type JobsPaginationProps = {
  currentPage: number
  totalPages: number
  totalResults: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function JobsPagination({
  currentPage,
  totalPages,
  totalResults,
  pageSize,
  onPageChange,
}: JobsPaginationProps): JSX.Element {
  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endResult = Math.min(currentPage * pageSize, totalResults)

  return (
    <div className="flex flex-col items-center justify-between gap-4 py-2 sm:flex-row">
      {/* Result Counter */}
      <div className="text-sm font-medium text-text-secondary">
        Showing{' '}
        <span className="font-semibold text-text-primary">{startResult}</span>{' '}
        to{' '}
        <span className="font-semibold text-text-primary">{endResult}</span>{' '}
        of{' '}
        <span className="font-semibold text-text-primary">{totalResults}</span>{' '}
        results
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="rounded-lg border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-text-dark hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
        >
          Previous
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
            // If many pages, show simple window or just standard pages
            if (
              totalPages > 5 &&
              pageNum !== 1 &&
              pageNum !== totalPages &&
              Math.abs(pageNum - currentPage) > 1
            ) {
              if (pageNum === 2 || pageNum === totalPages - 1) {
                return (
                  <span
                    key={`ellipsis-${pageNum}`}
                    className="px-1 text-sm text-text-muted"
                  >
                    ...
                  </span>
                )
              }
              return null
            }

            const isActive = pageNum === currentPage

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`min-w-[36px] rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border border-accent/20 bg-accent-light text-accent'
                    : 'border border-border bg-surface text-text-dark hover:bg-surface-secondary'
                }`}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="rounded-lg border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-text-dark hover:bg-surface-secondary disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  )
}
