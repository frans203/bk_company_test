import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ProductCostsModule } from './product-costs/product-costs.module';
import { OrdersModule } from './orders/orders.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ProductsModule,
    ProductCostsModule,
    OrdersModule,
    DashboardModule,
    SeedModule,
  ],
})
export class AppModule {}
