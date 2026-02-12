import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProductCostsService } from '../../../src/product-costs/application/services/product-costs.service';
import { PRODUCT_COST_REPOSITORY } from '../../../src/product-costs/domain/repositories/product-cost-repository.interface';
import { InMemoryProductCostRepository } from '../../../src/product-costs/infrastructure/repositories/in-memory-product-cost.repository';
import { PRODUCT_REPOSITORY } from '../../../src/products/domain/repositories/product-repository.interface';
import { InMemoryProductRepository } from '../../../src/products/infrastructure/repositories/in-memory-product.repository';
import { Product } from '../../../src/products/domain/entities/product.entity';

describe('ProductCostsService', () => {
  let service: ProductCostsService;
  let productRepository: InMemoryProductRepository;
  let product: Product;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductCostsService,
        {
          provide: PRODUCT_COST_REPOSITORY,
          useClass: InMemoryProductCostRepository,
        },
        {
          provide: PRODUCT_REPOSITORY,
          useClass: InMemoryProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductCostsService>(ProductCostsService);
    productRepository = module.get(PRODUCT_REPOSITORY);

    product = productRepository.create(
      new Product({ id: 'product-1', name: 'Camiseta', sku: 'SKU-001', price: 49.9 }),
    );
  });

  describe('upsert', () => {
    it('should create a cost for an existing product', () => {
      const cost = service.upsert({ productId: product.id, cost: 18 });

      expect(cost.productId).toBe(product.id);
      expect(cost.cost).toBe(18);
      expect(cost.id).toBeDefined();
    });

    it('should update the cost when upserting an existing product cost', () => {
      service.upsert({ productId: product.id, cost: 18 });
      const updated = service.upsert({ productId: product.id, cost: 22 });

      expect(updated.cost).toBe(22);
      expect(service.findAll()).toHaveLength(1);
    });

    it('should throw NotFoundException when product does not exist', () => {
      expect(() =>
        service.upsert({ productId: 'non-existent', cost: 10 }),
      ).toThrow(NotFoundException);
    });
  });

  describe('findByProductId', () => {
    it('should return the cost for a product', () => {
      service.upsert({ productId: product.id, cost: 18 });
      const cost = service.findByProductId(product.id);

      expect(cost.cost).toBe(18);
    });

    it('should throw NotFoundException when no cost exists for product', () => {
      expect(() => service.findByProductId(product.id)).toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all product costs', () => {
      const product2 = productRepository.create(
        new Product({ id: 'product-2', name: 'Calça', sku: 'SKU-002', price: 129.9 }),
      );

      service.upsert({ productId: product.id, cost: 18 });
      service.upsert({ productId: product2.id, cost: 52 });

      expect(service.findAll()).toHaveLength(2);
    });
  });
});
