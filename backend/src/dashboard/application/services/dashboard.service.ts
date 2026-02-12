import { Injectable, Inject } from '@nestjs/common';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../../orders/domain/repositories/order-repository.interface';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../../products/domain/repositories/product-repository.interface';
import {
  IProductCostRepository,
  PRODUCT_COST_REPOSITORY,
} from '../../../product-costs/domain/repositories/product-cost-repository.interface';
import { Order } from '../../../orders/domain/entities/order.entity';
import { DashboardQueryDto } from '../dto/dashboard-query.dto';
import { DashboardResponseDto } from '../dto/dashboard-response.dto';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(PRODUCT_COST_REPOSITORY)
    private readonly productCostRepository: IProductCostRepository,
  ) {}

  getDashboard(query: DashboardQueryDto): DashboardResponseDto {
    const orders = this.getFilteredOrders(query);

    const orderCount = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalCost = this.calculateTotalCost(orders);
    const profit = totalRevenue - totalCost;

    return { orderCount, totalRevenue, totalCost, profit };
  }

  private getFilteredOrders(query: DashboardQueryDto): Order[] {
    if (!query.startDate && !query.endDate) {
      return this.orderRepository.findAll();
    }

    const startDate = query.startDate
      ? new Date(query.startDate)
      : new Date(0);
    const endDate = query.endDate
      ? this.endOfDay(new Date(query.endDate))
      : new Date(8640000000000000);

    return this.orderRepository.findByDateRange(startDate, endDate);
  }

  private endOfDay(date: Date): Date {
    const end = new Date(date);
    end.setUTCHours(23, 59, 59, 999);
    return end;
  }

  private calculateTotalCost(orders: Order[]): number {
    let totalCost = 0;

    for (const order of orders) {
      for (const item of order.items) {
        const product = this.productRepository.findBySku(item.productSku);
        if (!product) continue;

        const productCost = this.productCostRepository.findByProductId(product.id);
        if (!productCost) continue;

        totalCost += productCost.cost * item.quantity;
      }
    }

    return totalCost;
  }
}
