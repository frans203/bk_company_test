import { Injectable } from '@nestjs/common';
import { IOrderRepository } from '../../domain/repositories/order-repository.interface';
import { Order } from '../../domain/entities/order.entity';

@Injectable()
export class InMemoryOrderRepository implements IOrderRepository {
  private readonly orders: Map<string, Order> = new Map();

  findAll(): Order[] {
    return Array.from(this.orders.values());
  }

  findById(id: string): Order | undefined {
    return this.orders.get(id);
  }

  create(order: Order): Order {
    this.orders.set(order.id, order);
    return order;
  }

  findByDateRange(startDate: Date, endDate: Date): Order[] {
    return this.findAll().filter(
      (order) => order.createdAt >= startDate && order.createdAt <= endDate,
    );
  }
}
