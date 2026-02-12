import { Order } from '../../domain/entities/order.entity';

export interface IOrderMapper {
  readonly platformName: string;
  toDomain(externalPayload: unknown): Order;
}
