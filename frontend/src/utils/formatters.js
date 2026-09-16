/**
 * Formats view count into YouTube-style compact numbers (e.g., 950, 1K, 10.3K, 1.5M, 2B).
 * Handles numbers, strings, and MongoDB populated arrays.
 * 
 * @param {number|string|Array} views - Raw view count or views array
 * @returns {string} Formatted view string (e.g., "10.3K")
 */
export function formatViews(views) {
  if (views === null || views === undefined) return '0'

  // Handle MongoDB views array or primitive number
  const count = Array.isArray(views) ? views.length : Number(views)
  if (isNaN(count) || count < 0) return String(views)

  if (count < 1000) {
    return `${count}`
  }

  if (count < 1_000_000) {
    const k = count / 1000
    // e.g. 1K, 10.3K, 950K (omit decimal for >= 100K or whole numbers)
    const formatted = (k % 1 === 0 || k >= 100) ? Math.floor(k) : k.toFixed(1).replace(/\.0$/, '')
    return `${formatted}K`
  }

  if (count < 1_000_000_000) {
    const m = count / 1_000_000
    // e.g. 1M, 1.5M, 25M
    const formatted = (m % 1 === 0 || m >= 100) ? Math.floor(m) : m.toFixed(1).replace(/\.0$/, '')
    return `${formatted}M`
  }

  const b = count / 1_000_000_000
  // e.g. 1B, 1.2B
  const formatted = (b % 1 === 0 || b >= 100) ? Math.floor(b) : b.toFixed(1).replace(/\.0$/, '')
  return `${formatted}B`
}

/**
 * Converts video duration in seconds into YouTube-style "MM:SS" or "HH:MM:SS".
 * 
 * @param {number|string} duration - Duration in seconds
 * @returns {string} Formatted duration (e.g. "20:45", "1:05:30")
 */
export function formatDuration(duration) {
  if (!duration && duration !== 0) return '0:00'

  // If already formatted like "20:45", return as is
  if (typeof duration === 'string' && duration.includes(':')) {
    return duration
  }

  const totalSeconds = Math.floor(Number(duration))
  if (isNaN(totalSeconds) || totalSeconds <= 0) return '0:00'

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const paddedSeconds = String(seconds).padStart(2, '0')

  if (hours > 0) {
    const paddedMinutes = String(minutes).padStart(2, '0')
    return `${hours}:${paddedMinutes}:${paddedSeconds}`
  }

  return `${minutes}:${paddedSeconds}`
}

/**
 * Converts timestamp / date into YouTube-style relative time ago
 * (e.g., "just now", "44 minutes ago", "2 hours ago", "3 days ago", "1 year ago").
 * 
 * @param {string|Date|number} dateInput - ISO string, timestamp, or Date object
 * @returns {string} Relative time ago
 */
export function formatTimeAgo(dateInput) {
  if (!dateInput) return ''

  // If already formatted like "44 minutes ago", return as is
  if (typeof dateInput === 'string' && (dateInput.includes('ago') || dateInput === 'just now')) {
    return dateInput
  }

  const date = new Date(dateInput)
  if (isNaN(date.getTime())) return String(dateInput)

  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 5) return 'just now'

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }

  return 'just now'
}
