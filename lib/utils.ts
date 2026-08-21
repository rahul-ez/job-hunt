export const MATCH_THRESHOLD = 70

export function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null
  if (min && max) {
    return `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`
  }
  if (min) {
    return `$${Math.round(min / 1000)}k+`
  }
  if (max) {
    return `Up to $${Math.round(max / 1000)}k`
  }
  return null
}

export function formatTimeAgo(isoString?: string | null): string {
  if (!isoString) return 'Recently'

  const date = new Date(isoString)
  if (isNaN(date.getTime())) return 'Recently'

  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInSecs = Math.floor(diffInMs / 1000)
  const diffInMins = Math.floor(diffInSecs / 60)
  const diffInHours = Math.floor(diffInMins / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInSecs < 60) return 'Just now'
  if (diffInMins < 60) return `${diffInMins}m ago`
  if (diffInHours === 1) return '1 hour ago'
  if (diffInHours < 24) return `${diffInHours} hours ago`
  if (diffInDays === 1) return 'Yesterday'
  if (diffInDays < 7) return `${diffInDays} days ago`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
  return `${Math.floor(diffInDays / 30)} months ago`
}
