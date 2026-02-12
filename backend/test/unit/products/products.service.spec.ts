import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { ProductsService } from '../../../src/products/application/services/products.service';
import { PRODUCT_REPOSITORY } from '../../../src/products/domain/repositories/product-repository.interface';
import { InMemoryProductRepository } from '../../../src/products/infrastructure/repositories/in-memory-product.repository';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PRODUCT_REPOSITORY,
          useClass: InMemoryProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('should create a product with a generated UUID', () => {
      const product = service.create({
        name: 'Camiseta Básica',
        sku: 'SKU-001',
        price: 49.9,
      });

      expect(product.id).toBeDefined();
      expect(product.name).toBe('Camiseta Básica');
      expect(product.sku).toBe('SKU-001');
      expect(product.price).toBe(49.9);
    });

    it('should throw ConflictException when SKU already exists', () => {
      service.create({ name: 'Produto A', sku: 'SKU-001', price: 10 });

      expect(() =>
        service.create({ name: 'Produto B', sku: 'SKU-001', price: 20 }),
      ).toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when no products exist', () => {
      expect(service.findAll()).toEqual([]);
    });

    it('should return all created products', () => {
      service.create({ name: 'Produto A', sku: 'SKU-001', price: 10 });
      service.create({ name: 'Produto B', sku: 'SKU-002', price: 20 });

      expect(service.findAll()).toHaveLength(2);
    });
  });

  describe('findById', () => {
    it('should return the product when it exists', () => {
      const created = service.create({ name: 'Produto A', sku: 'SKU-001', price: 10 });
      const found = service.findById(created.id);

      expect(found.id).toBe(created.id);
    });

    it('should throw NotFoundException when product does not exist', () => {
      expect(() => service.findById('non-existent-id')).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should partially update a product', () => {
      const created = service.create({ name: 'Produto A', sku: 'SKU-001', price: 10 });
      const updated = service.update(created.id, { price: 25 });

      expect(updated.price).toBe(25);
      expect(updated.name).toBe('Produto A');
    });

    it('should throw NotFoundException when updating non-existent product', () => {
      expect(() => service.update('non-existent-id', { price: 25 })).toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an existing product', () => {
      const created = service.create({ name: 'Produto A', sku: 'SKU-001', price: 10 });
      service.delete(created.id);

      expect(service.findAll()).toHaveLength(0);
    });

    it('should throw NotFoundException when deleting non-existent product', () => {
      expect(() => service.delete('non-existent-id')).toThrow(NotFoundException);
    });
  });
});
