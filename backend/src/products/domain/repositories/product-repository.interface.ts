import { Product } from '../entities/product.entity';

export interface IProductRepository {
  findAll(): Product[];
  findById(id: string): Product | undefined;
  findBySku(sku: string): Product | undefined;
  create(product: Product): Product;
  update(id: string, data: Partial<Product>): Product | undefined;
  delete(id: string): boolean;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
