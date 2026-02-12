import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
  IsEmail,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class BuyerDto {
  @ApiProperty({ example: 'Maria Souza' })
  @IsString()
  @IsNotEmpty()
  buyerName: string;

  @ApiProperty({ example: 'maria@email.com' })
  @IsString()
  @IsEmail()
  buyerEmail: string;
}

class LineItemDto {
  @ApiProperty({ example: 'P-001' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ example: 'Camiseta Básica' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  qty: number;

  @ApiProperty({ example: 49.9 })
  @IsNumber()
  unitPrice: number;
}

export class EcommercePlatformAWebhookDto {
  @ApiProperty({ example: 'ORD-98432' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ type: BuyerDto })
  @ValidateNested()
  @Type(() => BuyerDto)
  buyer: BuyerDto;

  @ApiProperty({ type: [LineItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  lineItems: LineItemDto[];

  @ApiProperty({ example: 229.7 })
  @IsNumber()
  totalAmount: number;

  @ApiProperty({ example: '2025-02-10T14:32:00Z' })
  @IsDateString()
  createdAt: string;
}
