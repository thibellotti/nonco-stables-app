import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { cn, formatCompact, getDateGroup, timeAgo } from './utils'

// ---------------------------------------------------------------------------
// cn()
// ---------------------------------------------------------------------------

describe('cn', () => {
  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('')
  })

  it('returns a single class untouched', () => {
    expect(cn('px-4')).toBe('px-4')
  })

  it('merges multiple classes', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'hidden', 'extra')).toBe('base extra')
  })

  it('deduplicates conflicting tailwind classes', () => {
    // tailwind-merge should keep only the last conflicting utility
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })
})

// ---------------------------------------------------------------------------
// formatCompact()
// ---------------------------------------------------------------------------

describe('formatCompact', () => {
  it('formats millions', () => {
    expect(formatCompact(1_000_000)).toBe('$1.0M')
    expect(formatCompact(2_500_000)).toBe('$2.5M')
  })

  it('formats thousands', () => {
    expect(formatCompact(1_000)).toBe('$1K')
    expect(formatCompact(42_000)).toBe('$42K')
  })

  it('formats small numbers', () => {
    expect(formatCompact(500)).toBe('$500')
    expect(formatCompact(0)).toBe('$0')
  })

  it('respects custom prefix', () => {
    expect(formatCompact(1_000_000, '€')).toBe('€1.0M')
    expect(formatCompact(5_000, '')).toBe('5K')
  })
})

// ---------------------------------------------------------------------------
// getDateGroup()
// ---------------------------------------------------------------------------

describe('getDateGroup', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Fix "now" to 2026-04-08 12:00 UTC
    vi.setSystemTime(new Date('2026-04-08T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "Today" for today\'s date', () => {
    expect(getDateGroup(new Date('2026-04-08T08:00:00Z'))).toBe('Today')
  })

  it('returns "Yesterday" for yesterday\'s date', () => {
    expect(getDateGroup(new Date('2026-04-07T15:00:00Z'))).toBe('Yesterday')
  })

  it('returns "This Week" for dates within the last 7 days', () => {
    expect(getDateGroup(new Date('2026-04-03T10:00:00Z'))).toBe('This Week')
  })

  it('returns "Earlier" for dates older than a week', () => {
    expect(getDateGroup(new Date('2026-03-25T10:00:00Z'))).toBe('Earlier')
  })
})

// ---------------------------------------------------------------------------
// timeAgo()
// ---------------------------------------------------------------------------

describe('timeAgo', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-04-08T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "just now" for very recent dates', () => {
    const date = new Date(Date.now() - 30_000) // 30 seconds ago
    expect(timeAgo(date)).toBe('just now')
  })

  it('returns minutes ago', () => {
    const date = new Date(Date.now() - 5 * 60 * 1000) // 5 minutes ago
    expect(timeAgo(date)).toBe('5m ago')
  })

  it('returns hours ago', () => {
    const date = new Date(Date.now() - 3 * 60 * 60 * 1000) // 3 hours ago
    expect(timeAgo(date)).toBe('3h ago')
  })

  it('returns days ago', () => {
    const date = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    expect(timeAgo(date)).toBe('2d ago')
  })
})
