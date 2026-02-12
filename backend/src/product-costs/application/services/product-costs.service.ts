import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IProductCostRepository,
  PRODUCT_COST_REPOSITORY,
} from '../../domain/repositories/product-cost-repository.interface';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../products/domain/repositories/product-repository.interface';
import { ProductCost } from '../../domain/entities/product-cost.entity';
import { UpsertProductCostDto } from '../dto/upsert-product-cost.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductCostsService {
  constructor(
    @Inject(PRODUCT_COST_REPOSITORY)
    private readonly productCostRepository: IProductCostRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  findAll(): ProductCost[] {
    return this.productCostRepository.findAll();
  }

  findByProductId(productId: string): ProductCost {
    const cost = this.productCostRepository.findByProductId(productId);
    if (!cost) {
      throw new NotFoundException(
        `Cost for product "${productId}" not found`,
      );
    }
    return cost;
  }

  upsert(dto: UpsertProductCostDto): ProductCost {
    const product = this.productRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundException(
        `Product with id "${dto.productId}" not found`,
      );
    }

    const productCost = new ProductCost({
      id: randomUUID(),
      productId: dto.productId,
      cost: dto.cost,
    });

    return this.productCostRepository.upsertByProductId(productCost);
  }
}
