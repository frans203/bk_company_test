import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { OrdersController } from './presentation/controllers/orders.controller';
import { OrdersService } from './application/services/orders.service';
import { InMemoryOrderRepository } from './infrastructure/repositories/in-memory-order.repository';
import { ORDER_REPOSITORY } from './domain/repositories/order-repository.interface';
import { OrderMapperRegistry } from './application/mappers/order-mapper.registry';
import { EcommercePlatformAMapper } from './application/mappers/ecommerce-platform-a.mapper';

@Module({
  imports: [DiscoveryModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    OrderMapperRegistry,
    EcommercePlatformAMapper,
    {
      provide: ORDER_REPOSITORY,
      useClass: InMemoryOrderRepository,
    },
  ],
  exports: [ORDER_REPOSITORY],
})
export class OrdersModule {}
