import { Order } from '../entities/order.entity';

export interface IOrderRepository {
  findAll(): Order[];
  findById(id: string): Order | undefined;
  create(order: Order): Order;
  findByDateRange(startDate: Date, endDate: Date): Order[];
}

export const ORDER_REPOSITORY = 'ORDER_REPOSITORY';
