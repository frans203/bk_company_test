import { ProductCost } from '../entities/product-cost.entity';

export interface IProductCostRepository {
  findAll(): ProductCost[];
  findById(id: string): ProductCost | undefined;
  findByProductId(productId: string): ProductCost | undefined;
  upsertByProductId(productCost: ProductCost): ProductCost;
  delete(id: string): boolean;
}

export const PRODUCT_COST_REPOSITORY = 'PRODUCT_COST_REPOSITORY';
