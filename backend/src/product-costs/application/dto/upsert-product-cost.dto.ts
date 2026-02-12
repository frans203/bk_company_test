import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpsertProductCostDto {
  @ApiProperty({ example: 'product-uuid-here', description: 'Product ID (UUID)' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 18.0, description: 'Product cost value' })
  @IsNumber()
  @IsPositive()
  cost: number;
}
