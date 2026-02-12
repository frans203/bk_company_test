import { api } from './axios'
import type { Product, CreateProductRequest, UpdateProductRequest } from '@/types'

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products')
  return data
}

export async function createProduct(body: CreateProductRequest): Promise<Product> {
  const { data } = await api.post<Product>('/products', body)
  return data
}

export async function updateProduct(id: string, body: UpdateProductRequest): Promise<Product> {
  const { data } = await api.patch<Product>(`/products/${id}`, body)
  return data
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`)
}
