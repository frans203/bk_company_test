import { Injectable } from '@nestjs/common';
import { IProductCostRepository } from '../../domain/repositories/product-cost-repository.interface';
import { ProductCost } from '../../domain/entities/product-cost.entity';

@Injectable()
export class InMemoryProductCostRepository implements IProductCostRepository {
  private readonly productCosts: Map<string, ProductCost> = new Map();

  findAll(): ProductCost[] {
    return Array.from(this.productCosts.values());
  }

  findById(id: string): ProductCost | undefined {
    return this.productCosts.get(id);
  }

  findByProductId(productId: string): ProductCost | undefined {
    return this.findAll().find((cost) => cost.productId === productId);
  }

  upsertByProductId(productCost: ProductCost): ProductCost {
    const existing = this.findByProductId(productCost.productId);

    if (existing) {
      const updated = new ProductCost({
        id: existing.id,
        productId: existing.productId,
        cost: productCost.cost,
      });
      this.productCosts.set(existing.id, updated);
      return updated;
    }

    this.productCosts.set(productCost.id, productCost);
    return productCost;
  }

  delete(id: string): boolean {
    return this.productCosts.delete(id);
  }
}
