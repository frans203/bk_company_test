import { ApiProperty } from '@nestjs/swagger';

export class DashboardResponseDto {
  @ApiProperty({ example: 1248 })
  orderCount: number;

  @ApiProperty({ example: 245890.0 })
  totalRevenue: number;

  @ApiProperty({ example: 98340.0 })
  totalCost: number;

  @ApiProperty({ example: 147550.0 })
  profit: number;
}
