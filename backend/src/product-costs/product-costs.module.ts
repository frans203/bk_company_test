import { Module } from '@nestjs/common';
import { ProductCostsController } from './presentation/controllers/product-costs.controller';
import { ProductCostsService } from './application/services/product-costs.service';
import { InMemoryProductCostRepository } from './infrastructure/repositories/in-memory-product-cost.repository';
import { PRODUCT_COST_REPOSITORY } from './domain/repositories/product-cost-repository.interface';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [ProductCostsController],
  providers: [
    ProductCostsService,
    {
      provide: PRODUCT_COST_REPOSITORY,
      useClass: InMemoryProductCostRepository,
    },
  ],
  exports: [PRODUCT_COST_REPOSITORY],
})
export class ProductCostsModule {}
