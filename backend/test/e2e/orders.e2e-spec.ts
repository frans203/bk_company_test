import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Orders (e2e)', () => {
  let app: INestApplication;

  const webhookPayload = {
    id: 'ORD-98432',
    buyer: { buyerName: 'Maria Souza', buyerEmail: 'maria@email.com' },
    lineItems: [
      { itemId: 'P-001', itemName: 'Camiseta Básica', qty: 2, unitPrice: 49.9 },
      { itemId: 'P-002', itemName: 'Calça Jeans', qty: 1, unitPrice: 129.9 },
    ],
    totalAmount: 229.7,
    createdAt: '2025-02-10T14:32:00Z',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /orders/webhook/platform-a — should create an order from webhook', async () => {
    const res = await request(app.getHttpServer())
      .post('/orders/webhook/platform-a')
      .send(webhookPayload)
      .expect(201);

    expect(res.body.id).toBe('ORD-98432');
    expect(res.body.customerName).toBe('Maria Souza');
    expect(res.body.customerEmail).toBe('maria@email.com');
    expect(res.body.items).toHaveLength(2);
    expect(res.body.totalAmount).toBe(229.7);
  });

  it('POST /orders/webhook/platform-a — should map external fields to domain fields', async () => {
    const res = await request(app.getHttpServer())
      .post('/orders/webhook/platform-a')
      .send({ ...webhookPayload, id: 'ORD-99999' })
      .expect(201);

    const item = res.body.items[0];
    expect(item.productSku).toBe('P-001');
    expect(item.productName).toBe('Camiseta Básica');
    expect(item.quantity).toBe(2);
    expect(item.unitPrice).toBe(49.9);
    expect(item.subtotal).toBeCloseTo(99.8);
  });

  it('POST /orders/webhook/unknown — should reject unknown platform', async () => {
    await request(app.getHttpServer())
      .post('/orders/webhook/unknown')
      .send(webhookPayload)
      .expect(400);
  });

  it('POST /orders/webhook/platform-a — should reject invalid payload', async () => {
    await request(app.getHttpServer())
      .post('/orders/webhook/platform-a')
      .send({ id: 'ORD-001' })
      .expect(400);
  });

  it('GET /orders — should list all orders', async () => {
    const res = await request(app.getHttpServer())
      .get('/orders')
      .expect(200);

    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /orders/:id — should return order by ID', async () => {
    const res = await request(app.getHttpServer())
      .get('/orders/ORD-98432')
      .expect(200);

    expect(res.body.customerEmail).toBe('maria@email.com');
  });

  it('GET /orders/:id — should return 404 for non-existent order', async () => {
    await request(app.getHttpServer())
      .get('/orders/ORD-00000')
      .expect(404);
  });
});
