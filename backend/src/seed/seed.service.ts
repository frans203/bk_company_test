import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../products/domain/repositories/product-repository.interface';
import {
  IOrderRepository,
  ORDER_REPOSITORY,
} from '../orders/domain/repositories/order-repository.interface';
import {
  IProductCostRepository,
  PRODUCT_COST_REPOSITORY,
} from '../product-costs/domain/repositories/product-cost-repository.interface';
import { Product } from '../products/domain/entities/product.entity';
import { Order } from '../orders/domain/entities/order.entity';
import { OrderItem } from '../orders/domain/entities/order-item.entity';
import { ProductCost } from '../product-costs/domain/entities/product-cost.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(PRODUCT_COST_REPOSITORY)
    private readonly productCostRepository: IProductCostRepository,
  ) {}

  onModuleInit() {
    this.seed();
  }

  private seed() {
    const products = this.seedProducts();
    this.seedProductCosts(products);
    this.seedOrders(products);
    this.logger.log(
      `Seed completed: ${products.length} products, ${this.productCostRepository.findAll().length} costs, ${this.orderRepository.findAll().length} orders`,
    );
  }

  private seedProducts(): Product[] {
    const data = [
      { name: 'Camiseta Básica', sku: 'SKU-001', price: 49.9 },
      { name: 'Calça Jeans', sku: 'SKU-002', price: 129.9 },
      { name: 'Tênis Esportivo', sku: 'SKU-003', price: 199.9 },
      { name: 'Jaqueta Corta-Vento', sku: 'SKU-004', price: 249.9 },
    ];

    return data.map((p) =>
      this.productRepository.create(
        new Product({ id: randomUUID(), name: p.name, sku: p.sku, price: p.price }),
      ),
    );
  }

  private seedProductCosts(products: Product[]) {
    const costMap: Record<string, number> = {
      'SKU-001': 18.0,
      'SKU-002': 52.0,
      'SKU-003': 85.0,
      'SKU-004': 110.0,
    };

    for (const product of products) {
      const cost = costMap[product.sku];
      if (cost == null) continue;
      this.productCostRepository.upsertByProductId(
        new ProductCost({ id: randomUUID(), productId: product.id, cost }),
      );
    }
  }

  private seedOrders(products: Product[]) {
    const skuMap = new Map(products.map((p) => [p.sku, p]));

    const orders = [
      {
        id: 'ORD-98432',
        customerName: 'Maria Souza',
        customerEmail: 'maria@email.com',
        createdAt: new Date('2025-02-10T14:32:00Z'),
        items: [
          { sku: 'SKU-001', qty: 2 },
          { sku: 'SKU-002', qty: 1 },
        ],
      },
      {
        id: 'ORD-98431',
        customerName: 'João Silva',
        customerEmail: 'joao@email.com',
        createdAt: new Date('2025-02-09T10:15:00Z'),
        items: [
          { sku: 'SKU-003', qty: 1 },
          { sku: 'SKU-004', qty: 1 },
          { sku: 'SKU-001', qty: 1 },
        ],
      },
      {
        id: 'ORD-98430',
        customerName: 'Ana Costa',
        customerEmail: 'ana@email.com',
        createdAt: new Date('2025-02-08T16:45:00Z'),
        items: [{ sku: 'SKU-001', qty: 1 }, { sku: 'SKU-002', qty: 1 }],
      },
      {
        id: 'ORD-98429',
        customerName: 'Carlos Mendes',
        customerEmail: 'carlos@email.com',
        createdAt: new Date('2025-02-07T09:20:00Z'),
        items: [
          { sku: 'SKU-004', qty: 1 },
          { sku: 'SKU-003', qty: 1 },
        ],
      },
      {
        id: 'ORD-98428',
        customerName: 'Fernanda Lima',
        customerEmail: 'fernanda@email.com',
        createdAt: new Date('2025-02-06T11:50:00Z'),
        items: [
          { sku: 'SKU-002', qty: 1 },
          { sku: 'SKU-001', qty: 1 },
        ],
      },
    ];

    for (const orderData of orders) {
      const items = orderData.items.map((item) => {
        const product = skuMap.get(item.sku)!;
        return new OrderItem({
          productSku: product.sku,
          productName: product.name,
          quantity: item.qty,
          unitPrice: product.price,
        });
      });

      const totalAmount = items.reduce((sum, i) => sum + i.subtotal, 0);

      this.orderRepository.create(
        new Order({
          id: orderData.id,
          customerName: orderData.customerName,
          customerEmail: orderData.customerEmail,
          items,
          totalAmount,
          createdAt: orderData.createdAt,
        }),
      );
    }
  }
}
