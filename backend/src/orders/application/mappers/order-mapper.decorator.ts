import { SetMetadata } from '@nestjs/common';

export const ORDER_MAPPER_KEY = 'ORDER_MAPPER';
export const OrderMapper = () => SetMetadata(ORDER_MAPPER_KEY, true);
