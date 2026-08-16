import type { JSX } from 'react'
import { AlertCircle } from 'lucide-react'

type Props = {
  completionPercent: number
  missingFields: string[]
}

export function ProfileBanner({ completionPercent, missingFields }: Props): JSX.Element {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (completionPercent / 100) * circumference

  const isComplete = completionPercent === 100

  if (isComplete) return <></>

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex items-center justify-between gap-6 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <AlertCircle size={16} className="text-error" strokeWidth={2} />
          <h2 className="text-base font-semibold text-text-primary">Profile needs attention</h2>
        </div>
        <p className="text-sm font-medium text-text-secondary mb-4">
          Complete the missing fields to improve your chance of getting tailored matches and
          generating quality resumes.
        </p>
        <div className="flex flex-wrap gap-2">
          {missingFields.map((field) => (
            <span
              key={field}
              className="px-2 py-0.5 rounded-full text-xs font-semibold uppercase bg-accent-light text-accent"
            >
              {field}
            </span>
          ))}
        </div>
      </div>

      {/* Circular progress ring */}
      <div className="shrink-0 relative flex items-center justify-center" style={{ width: 96, height: 96 }}>
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90">
          {/* Track */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="8"
          />
          {/* Progress — red/pink for incomplete */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            fill="none"
            stroke="var(--color-error)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <span className="absolute text-base font-semibold text-text-primary">
          {completionPercent}%
        </span>
      </div>
    </div>
  )
}
