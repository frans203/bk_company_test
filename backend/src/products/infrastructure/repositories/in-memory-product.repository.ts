import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../../domain/repositories/product-repository.interface';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class InMemoryProductRepository implements IProductRepository {
  private readonly products: Map<string, Product> = new Map();

  findAll(): Product[] {
    return Array.from(this.products.values());
  }

  findById(id: string): Product | undefined {
    return this.products.get(id);
  }

  findBySku(sku: string): Product | undefined {
    return this.findAll().find((product) => product.sku === sku);
  }

  create(product: Product): Product {
    this.products.set(product.id, product);
    return product;
  }

  update(id: string, data: Partial<Product>): Product | undefined {
    const existing = this.products.get(id);
    if (!existing) return undefined;

    const updated = new Product({
      ...existing,
      ...data,
      id: existing.id,
    });

    this.products.set(id, updated);
    return updated;
  }

  delete(id: string): boolean {
    return this.products.delete(id);
  }
}
