import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryModule } from '@nestjs/core';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { OrdersService } from '../../../src/orders/application/services/orders.service';
import { ORDER_REPOSITORY } from '../../../src/orders/domain/repositories/order-repository.interface';
import { InMemoryOrderRepository } from '../../../src/orders/infrastructure/repositories/in-memory-order.repository';
import { OrderMapperRegistry } from '../../../src/orders/application/mappers/order-mapper.registry';
import { EcommercePlatformAMapper } from '../../../src/orders/application/mappers/ecommerce-platform-a.mapper';

describe('OrdersService', () => {
  let service: OrdersService;

  const validWebhookPayload = {
    id: 'ORD-001',
    buyer: { buyerName: 'João Silva', buyerEmail: 'joao@email.com' },
    lineItems: [
      { itemId: 'P-001', itemName: 'Camiseta', qty: 1, unitPrice: 49.9 },
    ],
    totalAmount: 49.9,
    createdAt: '2025-02-10T14:32:00Z',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [
        OrdersService,
        OrderMapperRegistry,
        EcommercePlatformAMapper,
        {
          provide: ORDER_REPOSITORY,
          useClass: InMemoryOrderRepository,
        },
      ],
    }).compile();

    await module.init();

    service = module.get<OrdersService>(OrdersService);
  });

  describe('processWebhook', () => {
    it('should create an order from a valid platform-a webhook', () => {
      const order = service.processWebhook('platform-a', validWebhookPayload);

      expect(order.id).toBe('ORD-001');
      expect(order.customerName).toBe('João Silva');
      expect(order.items).toHaveLength(1);
    });

    it('should throw BadRequestException for unknown platform', () => {
      expect(() =>
        service.processWebhook('unknown-platform', validWebhookPayload),
      ).toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all orders', () => {
      service.processWebhook('platform-a', validWebhookPayload);
      service.processWebhook('platform-a', {
        ...validWebhookPayload,
        id: 'ORD-002',
      });

      expect(service.findAll()).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('should return an order by ID', () => {
      service.processWebhook('platform-a', validWebhookPayload);

      const order = service.findById('ORD-001');
      expect(order.customerName).toBe('João Silva');
    });

    it('should throw NotFoundException for non-existent order', () => {
      expect(() => service.findById('ORD-999')).toThrow(NotFoundException);
    });
  });
});
