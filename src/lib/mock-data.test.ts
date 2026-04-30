import { describe, it, expect } from 'vitest'
import {
  transactions,
  balances,
  BASE_RATES,
  instruments,
  favorites,
  recentTrades,
  yieldVaults,
} from './mock-data'

// ---------------------------------------------------------------------------
// transactions
// ---------------------------------------------------------------------------

describe('transactions', () => {
  it('is non-empty', () => {
    expect(transactions.length).toBeGreaterThan(0)
  })

  it('each transaction has required fields', () => {
    for (const tx of transactions) {
      expect(tx).toHaveProperty('id')
      expect(tx).toHaveProperty('type')
      expect(tx).toHaveProperty('description')
      expect(tx).toHaveProperty('amount')
      expect(tx).toHaveProperty('currency')
      expect(tx).toHaveProperty('timestamp')
      expect(tx).toHaveProperty('status')
    }
  })

  it('each transaction has a valid type', () => {
    const validTypes = ['deposit', 'withdrawal', 'trade', 'settlement']
    for (const tx of transactions) {
      expect(validTypes).toContain(tx.type)
    }
  })

  it('each transaction has a valid status', () => {
    const validStatuses = ['completed', 'pending', 'failed']
    for (const tx of transactions) {
      expect(validStatuses).toContain(tx.status)
    }
  })

  it('timestamps are valid Date objects', () => {
    for (const tx of transactions) {
      expect(tx.timestamp).toBeInstanceOf(Date)
      expect(tx.timestamp.getTime()).not.toBeNaN()
    }
  })
})

// ---------------------------------------------------------------------------
// balances
// ---------------------------------------------------------------------------

describe('balances', () => {
  it('is non-empty', () => {
    expect(balances.length).toBeGreaterThan(0)
  })

  it('each balance has expected structure', () => {
    for (const b of balances) {
      expect(b).toHaveProperty('currency')
      expect(b).toHaveProperty('available')
      expect(b).toHaveProperty('pending')
      expect(b).toHaveProperty('symbol')
      expect(typeof b.available).toBe('number')
      expect(typeof b.pending).toBe('number')
    }
  })

  it('includes at least USD and USDT', () => {
    const currencies = balances.map((b) => b.currency)
    expect(currencies).toContain('USD')
    expect(currencies).toContain('USDT')
  })
})

// ---------------------------------------------------------------------------
// BASE_RATES
// ---------------------------------------------------------------------------

describe('BASE_RATES', () => {
  it('has expected currency pairs', () => {
    expect(BASE_RATES).toHaveProperty('USDT/MXN')
    expect(BASE_RATES).toHaveProperty('EUR/USDT')
    expect(BASE_RATES).toHaveProperty('USDC/BRL')
    expect(BASE_RATES).toHaveProperty('GBP/USDC')
  })

  it('rates are positive numbers', () => {
    for (const [, rate] of Object.entries(BASE_RATES)) {
      expect(rate).toBeGreaterThan(0)
    }
  })
})

// ---------------------------------------------------------------------------
// instruments
// ---------------------------------------------------------------------------

describe('instruments', () => {
  it('is non-empty and each has pair, baseCurrency, quoteCurrency', () => {
    expect(instruments.length).toBeGreaterThan(0)
    for (const inst of instruments) {
      expect(inst.pair).toMatch(/^[A-Z]+\/[A-Z]+$/)
      expect(inst.baseCurrency.length).toBeGreaterThan(0)
      expect(inst.quoteCurrency.length).toBeGreaterThan(0)
    }
  })
})

// ---------------------------------------------------------------------------
// favorites
// ---------------------------------------------------------------------------

describe('favorites', () => {
  it('references valid instruments', () => {
    const validPairs = instruments.map((i) => i.pair)
    for (const fav of favorites) {
      expect(validPairs).toContain(fav.instrument.pair)
    }
  })
})

// ---------------------------------------------------------------------------
// recentTrades
// ---------------------------------------------------------------------------

describe('recentTrades', () => {
  it('is non-empty with valid sides', () => {
    expect(recentTrades.length).toBeGreaterThan(0)
    for (const trade of recentTrades) {
      expect(['buy', 'sell']).toContain(trade.side)
      expect(trade.quantity).toBeGreaterThan(0)
      expect(trade.price).toBeGreaterThan(0)
    }
  })
})

// ---------------------------------------------------------------------------
// yieldVaults
// ---------------------------------------------------------------------------

describe('yieldVaults', () => {
  it('has at least one active vault', () => {
    const active = yieldVaults.filter((v) => v.status === 'active')
    expect(active.length).toBeGreaterThan(0)
  })
})
