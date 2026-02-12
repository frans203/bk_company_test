import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Product Costs (e2e)', () => {
  let app: INestApplication;
  let productId: string;
  let initialCostCount: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    // Count seeded costs
    const costsRes = await request(app.getHttpServer()).get('/product-costs');
    initialCostCount = costsRes.body.length;

    // Create a dedicated test product
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Produto Teste Custo', sku: 'COST-TEST-001', price: 49.9 });
    productId = res.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('PUT /product-costs — should create a cost for an existing product', async () => {
    const res = await request(app.getHttpServer())
      .put('/product-costs')
      .send({ productId, cost: 18 })
      .expect(200);

    expect(res.body.productId).toBe(productId);
    expect(res.body.cost).toBe(18);
  });

  it('PUT /product-costs — should update cost on upsert', async () => {
    const res = await request(app.getHttpServer())
      .put('/product-costs')
      .send({ productId, cost: 22 })
      .expect(200);

    expect(res.body.cost).toBe(22);
  });

  it('PUT /product-costs — should reject non-existent product', async () => {
    await request(app.getHttpServer())
      .put('/product-costs')
      .send({ productId: 'non-existent-id', cost: 10 })
      .expect(404);
  });

  it('PUT /product-costs — should reject invalid body', async () => {
    await request(app.getHttpServer())
      .put('/product-costs')
      .send({ productId, cost: -5 })
      .expect(400);
  });

  it('GET /product-costs — should list all product costs including seeded', async () => {
    const res = await request(app.getHttpServer())
      .get('/product-costs')
      .expect(200);

    expect(res.body).toHaveLength(initialCostCount + 1);
    const testCost = res.body.find((c: any) => c.productId === productId);
    expect(testCost.cost).toBe(22);
  });

  it('GET /product-costs/:productId — should return cost by product ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/product-costs/${productId}`)
      .expect(200);

    expect(res.body.cost).toBe(22);
  });

  it('GET /product-costs/:productId — should return 404 for product without cost', async () => {
    const newProduct = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Sem Custo', sku: 'COST-TEST-002', price: 129.9 });

    await request(app.getHttpServer())
      .get(`/product-costs/${newProduct.body.id}`)
      .expect(404);
  });
});
