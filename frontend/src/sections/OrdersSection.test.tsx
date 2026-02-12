import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/helpers'
import { OrdersSection } from './OrdersSection'

vi.mock('@/api/orders', () => ({
  getOrders: vi.fn().mockResolvedValue([
    {
      id: 'ORD-001',
      customerName: 'Maria Souza',
      customerEmail: 'maria@email.com',
      items: [{ productSku: 'SKU-001', productName: 'Camiseta', quantity: 2, unitPrice: 49.90, subtotal: 99.80 }],
      totalAmount: 99.80,
      createdAt: '2025-02-10T14:32:00Z',
    },
  ]),
}))

describe('OrdersSection', () => {
  it('renders orders list', async () => {
    renderWithProviders(<OrdersSection />)
    await waitFor(() => {
      expect(screen.getByText('ORD-001')).toBeInTheDocument()
      expect(screen.getByText('Maria Souza')).toBeInTheDocument()
    })
  })

  it('expands order details on click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<OrdersSection />)
    await waitFor(() => expect(screen.getByText('ORD-001')).toBeInTheDocument())

    await user.click(screen.getByText('Maria Souza'))
    await waitFor(() => {
      expect(screen.getByText('maria@email.com')).toBeInTheDocument()
      expect(screen.getByText('Camiseta')).toBeInTheDocument()
    })
  })
})
