import { Module } from '@nestjs/common';
import { ProductsController } from './presentation/controllers/products.controller';
import { ProductsService } from './application/services/products.service';
import { InMemoryProductRepository } from './infrastructure/repositories/in-memory-product.repository';
import { PRODUCT_REPOSITORY } from './domain/repositories/product-repository.interface';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: InMemoryProductRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
