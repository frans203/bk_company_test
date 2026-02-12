import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithProviders } from '@/test/helpers'
import { DashboardSection } from './DashboardSection'

vi.mock('@/api/dashboard', () => ({
  getDashboard: vi.fn().mockResolvedValue({
    orderCount: 5,
    totalRevenue: 1000,
    totalCost: 400,
    profit: 600,
  }),
}))

describe('DashboardSection', () => {
  it('renders dashboard title', () => {
    renderWithProviders(<DashboardSection />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('displays metrics after loading', async () => {
    renderWithProviders(<DashboardSection />)
    await waitFor(() => {
      expect(screen.getByText(/1\.000,00/)).toBeInTheDocument()
    })
  })

  it('has date filter inputs and button', () => {
    renderWithProviders(<DashboardSection />)
    expect(screen.getByLabelText('Data Inicial')).toBeInTheDocument()
    expect(screen.getByLabelText('Data Final')).toBeInTheDocument()
    expect(screen.getByText('Filtrar')).toBeInTheDocument()
  })
})
