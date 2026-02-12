import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from '../../../src/dashboard/application/services/dashboard.service';
import { ORDER_REPOSITORY } from '../../../src/orders/domain/repositories/order-repository.interface';
import { InMemoryOrderRepository } from '../../../src/orders/infrastructure/repositories/in-memory-order.repository';
import { PRODUCT_REPOSITORY } from '../../../src/products/domain/repositories/product-repository.interface';
import { InMemoryProductRepository } from '../../../src/products/infrastructure/repositories/in-memory-product.repository';
import { PRODUCT_COST_REPOSITORY } from '../../../src/product-costs/domain/repositories/product-cost-repository.interface';
import { InMemoryProductCostRepository } from '../../../src/product-costs/infrastructure/repositories/in-memory-product-cost.repository';
import { Order } from '../../../src/orders/domain/entities/order.entity';
import { OrderItem } from '../../../src/orders/domain/entities/order-item.entity';
import { Product } from '../../../src/products/domain/entities/product.entity';
import { ProductCost } from '../../../src/product-costs/domain/entities/product-cost.entity';

describe('DashboardService', () => {
  let service: DashboardService;
  let orderRepository: InMemoryOrderRepository;
  let productRepository: InMemoryProductRepository;
  let productCostRepository: InMemoryProductCostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: ORDER_REPOSITORY, useClass: InMemoryOrderRepository },
        { provide: PRODUCT_REPOSITORY, useClass: InMemoryProductRepository },
        { provide: PRODUCT_COST_REPOSITORY, useClass: InMemoryProductCostRepository },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    orderRepository = module.get(ORDER_REPOSITORY);
    productRepository = module.get(PRODUCT_REPOSITORY);
    productCostRepository = module.get(PRODUCT_COST_REPOSITORY);
  });

  function seedData() {
    productRepository.create(new Product({ id: 'uuid-1', name: 'Camiseta', sku: 'P-001', price: 49.9 }));
    productRepository.create(new Product({ id: 'uuid-2', name: 'Calça', sku: 'P-002', price: 129.9 }));

    productCostRepository.upsertByProductId(new ProductCost({ id: 'cost-1', productId: 'uuid-1', cost: 18 }));
    productCostRepository.upsertByProductId(new ProductCost({ id: 'cost-2', productId: 'uuid-2', cost: 52 }));

    orderRepository.create(new Order({
      id: 'ORD-001',
      customerName: 'Maria Souza',
      customerEmail: 'maria@email.com',
      items: [
        new OrderItem({ productSku: 'P-001', productName: 'Camiseta', quantity: 2, unitPrice: 49.9 }),
        new OrderItem({ productSku: 'P-002', productName: 'Calça', quantity: 1, unitPrice: 129.9 }),
      ],
      totalAmount: 229.7,
      createdAt: new Date('2025-02-10T14:32:00Z'),
    }));

    orderRepository.create(new Order({
      id: 'ORD-002',
      customerName: 'João Silva',
      customerEmail: 'joao@email.com',
      items: [
        new OrderItem({ productSku: 'P-001', productName: 'Camiseta', quantity: 1, unitPrice: 49.9 }),
      ],
      totalAmount: 49.9,
      createdAt: new Date('2025-03-15T10:00:00Z'),
    }));
  }

  describe('getDashboard without filters', () => {
    it('should return zeros when no data exists', () => {
      const result = service.getDashboard({});

      expect(result.orderCount).toBe(0);
      expect(result.totalRevenue).toBe(0);
      expect(result.totalCost).toBe(0);
      expect(result.profit).toBe(0);
    });

    it('should return consolidated metrics for all orders', () => {
      seedData();
      const result = service.getDashboard({});

      expect(result.orderCount).toBe(2);
      expect(result.totalRevenue).toBeCloseTo(279.6);
      expect(result.totalCost).toBe(106);
      expect(result.profit).toBeCloseTo(173.6);
    });
  });

  describe('getDashboard with date filters', () => {
    beforeEach(() => seedData());

    it('should filter orders by startDate and endDate', () => {
      const result = service.getDashboard({
        startDate: '2025-02-01',
        endDate: '2025-02-28',
      });

      expect(result.orderCount).toBe(1);
      expect(result.totalRevenue).toBeCloseTo(229.7);
      expect(result.totalCost).toBe(88);
    });

    it('should filter with only startDate', () => {
      const result = service.getDashboard({ startDate: '2025-03-01' });

      expect(result.orderCount).toBe(1);
      expect(result.totalRevenue).toBeCloseTo(49.9);
      expect(result.totalCost).toBe(18);
    });

    it('should filter with only endDate', () => {
      const result = service.getDashboard({ endDate: '2025-02-28' });

      expect(result.orderCount).toBe(1);
      expect(result.totalRevenue).toBeCloseTo(229.7);
    });

    it('should include orders at end of day when using endDate', () => {
      // Order at 2025-02-10T14:32:00Z should be included with endDate=2025-02-10
      const result = service.getDashboard({
        startDate: '2025-02-10',
        endDate: '2025-02-10',
      });

      expect(result.orderCount).toBe(1);
      expect(result.totalRevenue).toBeCloseTo(229.7);
    });

    it('should return zero when no orders match the date range', () => {
      const result = service.getDashboard({
        startDate: '2026-01-01',
        endDate: '2026-12-31',
      });

      expect(result.orderCount).toBe(0);
      expect(result.totalRevenue).toBe(0);
      expect(result.totalCost).toBe(0);
      expect(result.profit).toBe(0);
    });
  });

  describe('cost calculation edge cases', () => {
    it('should handle orders with products that have no registered cost', () => {
      productRepository.create(new Product({ id: 'uuid-3', name: 'Tênis', sku: 'P-003', price: 199.9 }));

      orderRepository.create(new Order({
        id: 'ORD-003',
        customerName: 'Ana Costa',
        customerEmail: 'ana@email.com',
        items: [
          new OrderItem({ productSku: 'P-003', productName: 'Tênis', quantity: 1, unitPrice: 199.9 }),
        ],
        totalAmount: 199.9,
        createdAt: new Date('2025-04-01T10:00:00Z'),
      }));

      const result = service.getDashboard({});

      expect(result.orderCount).toBe(1);
      expect(result.totalRevenue).toBeCloseTo(199.9);
      expect(result.totalCost).toBe(0);
      expect(result.profit).toBeCloseTo(199.9);
    });

    it('should handle orders with unknown product SKUs gracefully', () => {
      orderRepository.create(new Order({
        id: 'ORD-004',
        customerName: 'Pedro Lima',
        customerEmail: 'pedro@email.com',
        items: [
          new OrderItem({ productSku: 'UNKNOWN-SKU', productName: 'Produto X', quantity: 1, unitPrice: 50 }),
        ],
        totalAmount: 50,
        createdAt: new Date('2025-05-01T10:00:00Z'),
      }));

      const result = service.getDashboard({});

      expect(result.orderCount).toBe(1);
      expect(result.totalRevenue).toBe(50);
      expect(result.totalCost).toBe(0);
      expect(result.profit).toBe(50);
    });
  });
});
