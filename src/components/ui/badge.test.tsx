import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('applies default variant classes', () => {
    render(<Badge>Default</Badge>)
    const el = screen.getByText('Default')
    expect(el).toHaveClass('inline-flex')
    expect(el).toHaveClass('rounded-full')
  })

  it('accepts custom className', () => {
    render(<Badge className="ml-2">Custom</Badge>)
    const el = screen.getByText('Custom')
    expect(el).toHaveClass('ml-2')
  })

  it('renders all variant types without error', () => {
    const variants = ['cyan', 'green', 'amber', 'purple', 'red', 'default'] as const
    for (const variant of variants) {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>)
      expect(screen.getByText(variant)).toBeInTheDocument()
      unmount()
    }
  })
})
