import { BadRequestException } from '@nestjs/common';
import { EcommercePlatformAMapper } from '../../../../src/orders/application/mappers/ecommerce-platform-a.mapper';
import { Order } from '../../../../src/orders/domain/entities/order.entity';

describe('EcommercePlatformAMapper', () => {
  let mapper: EcommercePlatformAMapper;

  beforeEach(() => {
    mapper = new EcommercePlatformAMapper();
  });

  const validPayload = {
    id: 'ORD-98432',
    buyer: {
      buyerName: 'Maria Souza',
      buyerEmail: 'maria@email.com',
    },
    lineItems: [
      { itemId: 'P-001', itemName: 'Camiseta Básica', qty: 2, unitPrice: 49.9 },
      { itemId: 'P-002', itemName: 'Calça Jeans', qty: 1, unitPrice: 129.9 },
    ],
    totalAmount: 229.7,
    createdAt: '2025-02-10T14:32:00Z',
  };

  it('should have platformName "platform-a"', () => {
    expect(mapper.platformName).toBe('platform-a');
  });

  it('should map a valid webhook payload to an Order domain entity', () => {
    const order = mapper.toDomain(validPayload);

    expect(order).toBeInstanceOf(Order);
    expect(order.id).toBe('ORD-98432');
    expect(order.customerName).toBe('Maria Souza');
    expect(order.customerEmail).toBe('maria@email.com');
    expect(order.totalAmount).toBe(229.7);
    expect(order.createdAt).toEqual(new Date('2025-02-10T14:32:00Z'));
  });

  it('should correctly map lineItems to OrderItems with renamed fields', () => {
    const order = mapper.toDomain(validPayload);

    expect(order.items).toHaveLength(2);

    expect(order.items[0].productSku).toBe('P-001');
    expect(order.items[0].productName).toBe('Camiseta Básica');
    expect(order.items[0].quantity).toBe(2);
    expect(order.items[0].unitPrice).toBe(49.9);
    expect(order.items[0].subtotal).toBeCloseTo(99.8);

    expect(order.items[1].productSku).toBe('P-002');
    expect(order.items[1].quantity).toBe(1);
    expect(order.items[1].subtotal).toBeCloseTo(129.9);
  });

  it('should throw BadRequestException for invalid payload (missing id)', () => {
    const invalidPayload = { ...validPayload, id: '' };

    expect(() => mapper.toDomain(invalidPayload)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for invalid buyer email', () => {
    const invalidPayload = {
      ...validPayload,
      buyer: { buyerName: 'Maria', buyerEmail: 'invalid-email' },
    };

    expect(() => mapper.toDomain(invalidPayload)).toThrow(BadRequestException);
  });

  it('should throw BadRequestException for missing lineItems', () => {
    const invalidPayload = { ...validPayload, lineItems: undefined };

    expect(() => mapper.toDomain(invalidPayload)).toThrow(BadRequestException);
  });
});
