import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/test/helpers'
import { ProductsSection } from './ProductsSection'

vi.mock('@/api/products', () => ({
  getProducts: vi.fn().mockResolvedValue([
    { id: '1', name: 'Camiseta Basica', sku: 'SKU-001', price: 49.90 },
    { id: '2', name: 'Calca Jeans', sku: 'SKU-002', price: 129.90 },
  ]),
  createProduct: vi.fn().mockResolvedValue({ id: '3', name: 'Novo', sku: 'SKU-003', price: 10 }),
  deleteProduct: vi.fn().mockResolvedValue(undefined),
}))

describe('ProductsSection', () => {
  it('renders product list', async () => {
    renderWithProviders(<ProductsSection />)
    await waitFor(() => {
      expect(screen.getByText('Camiseta Basica')).toBeInTheDocument()
      expect(screen.getByText('Calca Jeans')).toBeInTheDocument()
    })
  })

  it('opens create dialog on "+ Novo" click', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProductsSection />)
    await user.click(screen.getByText('+ Novo'))
    expect(screen.getByText('Novo Produto')).toBeInTheDocument()
  })

  it('shows delete confirmation dialog', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ProductsSection />)
    await waitFor(() => expect(screen.getByText('Camiseta Basica')).toBeInTheDocument())

    const deleteButtons = screen.getAllByRole('button', { name: '' })
    const trashButton = deleteButtons.find(btn => btn.querySelector('svg'))
    if (trashButton) await user.click(trashButton)

    await waitFor(() => {
      expect(screen.getByText('Excluir produto')).toBeInTheDocument()
      expect(screen.getByText('Cancelar')).toBeInTheDocument()
    })
  })
})
