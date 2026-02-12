import { Module } from '@nestjs/common';
import { DashboardController } from './presentation/controllers/dashboard.controller';
import { DashboardService } from './application/services/dashboard.service';
import { OrdersModule } from '../orders/orders.module';
import { ProductsModule } from '../products/products.module';
import { ProductCostsModule } from '../product-costs/product-costs.module';

@Module({
  imports: [OrdersModule, ProductsModule, ProductCostsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
