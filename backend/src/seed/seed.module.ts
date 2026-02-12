import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { ProductCostsModule } from '../product-costs/product-costs.module';

@Module({
  imports: [ProductsModule, OrdersModule, ProductCostsModule],
  providers: [SeedService],
})
export class SeedModule {}
