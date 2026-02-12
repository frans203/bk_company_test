import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductCostsService } from '../../application/services/product-costs.service';
import { UpsertProductCostDto } from '../../application/dto/upsert-product-cost.dto';
import { ProductCost } from '../../domain/entities/product-cost.entity';

@ApiTags('Product Costs')
@Controller('product-costs')
export class ProductCostsController {
  constructor(private readonly productCostsService: ProductCostsService) {}

  @Get()
  @ApiOperation({ summary: 'List all product costs' })
  findAll(): ProductCost[] {
    return this.productCostsService.findAll();
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get cost by product ID' })
  @ApiResponse({ status: 404, description: 'Cost not found' })
  findByProductId(@Param('productId') productId: string): ProductCost {
    return this.productCostsService.findByProductId(productId);
  }

  @Put()
  @ApiOperation({ summary: 'Create or update a product cost' })
  @ApiResponse({ status: 200, description: 'Cost upserted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  upsert(@Body() dto: UpsertProductCostDto): ProductCost {
    return this.productCostsService.upsert(dto);
  }
}
