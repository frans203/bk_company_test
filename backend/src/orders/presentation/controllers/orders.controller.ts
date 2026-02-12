import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrdersService } from '../../application/services/orders.service';
import { Order } from '../../domain/entities/order.entity';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('webhook/:platform')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Receive an order webhook from an e-commerce platform' })
  @ApiParam({ name: 'platform', example: 'platform-a' })
  @ApiResponse({ status: 201, description: 'Order created from webhook' })
  @ApiResponse({ status: 400, description: 'Invalid payload or unknown platform' })
  processWebhook(
    @Param('platform') platform: string,
    @Body() payload: unknown,
  ): Order {
    return this.ordersService.processWebhook(platform, payload);
  }

  @Get()
  @ApiOperation({ summary: 'List all orders' })
  findAll(): Order[] {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order by ID' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findById(@Param('id') id: string): Order {
    return this.ordersService.findById(id);
  }
}
