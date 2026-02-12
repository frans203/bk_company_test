import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import {
  IProductRepository,
  PRODUCT_REPOSITORY,
} from '../../domain/repositories/product-repository.interface';
import { Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  findAll(): Product[] {
    return this.productRepository.findAll();
  }

  findById(id: string): Product {
    const product = this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    return product;
  }

  create(dto: CreateProductDto): Product {
    const existing = this.productRepository.findBySku(dto.sku);
    if (existing) {
      throw new ConflictException(`Product with SKU "${dto.sku}" already exists`);
    }

    const product = new Product({
      id: randomUUID(),
      name: dto.name,
      sku: dto.sku,
      price: dto.price,
    });

    return this.productRepository.create(product);
  }

  update(id: string, dto: UpdateProductDto): Product {
    const updated = this.productRepository.update(id, dto);
    if (!updated) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
    return updated;
  }

  delete(id: string): void {
    const deleted = this.productRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }
  }
}
