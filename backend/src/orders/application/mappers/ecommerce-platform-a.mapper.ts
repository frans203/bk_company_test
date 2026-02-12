import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { IOrderMapper } from './order-mapper.interface';
import { OrderMapper } from './order-mapper.decorator';
import { Order } from '../../domain/entities/order.entity';
import { OrderItem } from '../../domain/entities/order-item.entity';
import { EcommercePlatformAWebhookDto } from '../../presentation/dto/ecommerce-platform-a-webhook.dto';

@Injectable()
@OrderMapper()
export class EcommercePlatformAMapper implements IOrderMapper {
  readonly platformName = 'platform-a';

  toDomain(externalPayload: unknown): Order {
    const dto = plainToInstance(
      EcommercePlatformAWebhookDto,
      externalPayload,
    );

    const errors = validateSync(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const messages = errors
        .map((e) => Object.values(e.constraints ?? {}))
        .flat();
      throw new BadRequestException(messages);
    }

    const items = dto.lineItems.map(
      (li) =>
        new OrderItem({
          productSku: li.itemId,
          productName: li.itemName,
          quantity: li.qty,
          unitPrice: li.unitPrice,
        }),
    );

    return new Order({
      id: dto.id,
      customerName: dto.buyer.buyerName,
      customerEmail: dto.buyer.buyerEmail,
      items,
      totalAmount: dto.totalAmount,
      createdAt: new Date(dto.createdAt),
    });
  }
}
