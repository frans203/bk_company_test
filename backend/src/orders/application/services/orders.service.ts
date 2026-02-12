import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../../domain/repositories/order-repository.interface';
import { Order } from '../../domain/entities/order.entity';
import { OrderMapperRegistry } from '../mappers/order-mapper.registry';

@Injectable()
export class OrdersService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    private readonly mapperRegistry: OrderMapperRegistry,
  ) {}

  processWebhook(platform: string, payload: unknown): Order {
    const mapper = this.mapperRegistry.getMapper(platform);
    const order = mapper.toDomain(payload);
    return this.orderRepository.create(order);
  }

  findAll(): Order[] {
    return this.orderRepository.findAll();
  }

  findById(id: string): Order {
    const order = this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with id "${id}" not found`);
    }
    return order;
  }

}
