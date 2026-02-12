import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Dashboard (e2e)', () => {
  let app: INestApplication;
  let seedOrderCount: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    // Get baseline from seed
    const baseline = await request(app.getHttpServer()).get('/dashboard');
    seedOrderCount = baseline.body.orderCount;

    // Create test products
    const product1 = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Dashboard Test A', sku: 'DASH-001', price: 49.9 });

    const product2 = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Dashboard Test B', sku: 'DASH-002', price: 129.9 });

    // Set costs
    await request(app.getHttpServer())
      .put('/product-costs')
      .send({ productId: product1.body.id, cost: 18 });

    await request(app.getHttpServer())
      .put('/product-costs')
      .send({ productId: product2.body.id, cost: 52 });

    // Create orders via webhook with unique dates (year 2030 to not clash with seed)
    await request(app.getHttpServer())
      .post('/orders/webhook/platform-a')
      .send({
        id: 'DASH-ORD-001',
        buyer: { buyerName: 'Maria Souza', buyerEmail: 'maria@email.com' },
        lineItems: [
          { itemId: 'DASH-001', itemName: 'Dashboard Test A', qty: 2, unitPrice: 49.9 },
          { itemId: 'DASH-002', itemName: 'Dashboard Test B', qty: 1, unitPrice: 129.9 },
        ],
        totalAmount: 229.7,
        createdAt: '2030-02-10T14:32:00Z',
      });

    await request(app.getHttpServer())
      .post('/orders/webhook/platform-a')
      .send({
        id: 'DASH-ORD-002',
        buyer: { buyerName: 'João Silva', buyerEmail: 'joao@email.com' },
        lineItems: [
          { itemId: 'DASH-001', itemName: 'Dashboard Test A', qty: 1, unitPrice: 49.9 },
        ],
        totalAmount: 49.9,
        createdAt: '2030-03-15T10:00:00Z',
      });
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /dashboard — should include test orders in total count', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard')
      .expect(200);

    expect(res.body.orderCount).toBe(seedOrderCount + 2);
  });

  it('GET /dashboard — should filter by startDate and endDate (2030-02 only)', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard?startDate=2030-02-01&endDate=2030-02-28')
      .expect(200);

    expect(res.body.orderCount).toBe(1);
    expect(res.body.totalRevenue).toBeCloseTo(229.7);
  });

  it('GET /dashboard — should filter with only startDate', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard?startDate=2030-03-01')
      .expect(200);

    expect(res.body.orderCount).toBe(1);
    expect(res.body.totalRevenue).toBeCloseTo(49.9);
  });

  it('GET /dashboard — should filter with only endDate', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard?endDate=2030-02-28')
      .expect(200);

    // All seed orders + 1 test order from Feb 2030
    expect(res.body.orderCount).toBe(seedOrderCount + 1);
  });

  it('GET /dashboard — should return zeros for out-of-range dates', async () => {
    const res = await request(app.getHttpServer())
      .get('/dashboard?startDate=2099-01-01&endDate=2099-12-31')
      .expect(200);

    expect(res.body.orderCount).toBe(0);
    expect(res.body.totalRevenue).toBe(0);
    expect(res.body.totalCost).toBe(0);
    expect(res.body.profit).toBe(0);
  });
});
