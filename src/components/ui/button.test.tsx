import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { Button } from './button'

afterEach(() => {
  cleanup()
})

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('fires onClick handler', () => {
    const handler = vi.fn()
    render(<Button onClick={handler}>Click</Button>)
    fireEvent.click(screen.getByRole('button', { name: 'Click' }))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state', () => {
    const handler = vi.fn()
    render(<Button disabled onClick={handler}>Disabled</Button>)
    const btn = screen.getByRole('button', { name: 'Disabled' })
    expect(btn).toBeDisabled()
    fireEvent.click(btn)
    expect(handler).not.toHaveBeenCalled()
  })

  it('applies cyan variant classes by default', () => {
    render(<Button>Cyan</Button>)
    const btn = screen.getByRole('button', { name: 'Cyan' })
    expect(btn.className).toContain('bg-[var(--cyan)]')
  })

  it('applies ghost variant classes', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const btn = screen.getByRole('button', { name: 'Ghost' })
    expect(btn.className).toContain('bg-transparent')
  })

  it('applies white variant classes', () => {
    render(<Button variant="white">White</Button>)
    const btn = screen.getByRole('button', { name: 'White' })
    expect(btn.className).toContain('bg-white')
  })

  it('applies size sm classes', () => {
    render(<Button size="sm">Small</Button>)
    const btn = screen.getByRole('button', { name: 'Small' })
    expect(btn.className).toContain('px-3')
    expect(btn.className).toContain('text-xs')
  })

  it('applies size lg classes', () => {
    render(<Button size="lg">Large</Button>)
    const btn = screen.getByRole('button', { name: 'Large' })
    expect(btn.className).toContain('px-6')
    expect(btn.className).toContain('text-base')
  })
})
