import { describe, it, expect } from 'vitest'
import { formatBRL } from './format'

describe('formatBRL', () => {
  it('formats positive value as BRL currency', () => {
    expect(formatBRL(49.90)).toContain('R$')
    expect(formatBRL(49.90)).toContain('49,90')
  })

  it('formats zero', () => {
    expect(formatBRL(0)).toContain('0,00')
  })

  it('formats large values with thousand separator', () => {
    expect(formatBRL(147550)).toContain('147.550,00')
  })
})
