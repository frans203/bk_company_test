import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Products (e2e)', () => {
  let app: INestApplication;
  let initialCount: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    await app.init();

    // Count seeded products
    const res = await request(app.getHttpServer()).get('/products');
    initialCount = res.body.length;
  });

  afterAll(async () => {
    await app.close();
  });

  let productId: string;

  it('POST /products — should create a product', async () => {
    const res = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Camiseta Básica', sku: 'P-001', price: 49.9 })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe('Camiseta Básica');
    expect(res.body.sku).toBe('P-001');
    expect(res.body.price).toBe(49.9);
    productId = res.body.id;
  });

  it('POST /products — should reject duplicate SKU', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Duplicata', sku: 'P-001', price: 10 })
      .expect(409);
  });

  it('POST /products — should reject invalid body (missing required fields)', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({ name: '' })
      .expect(400);
  });

  it('POST /products — should reject unknown fields', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Test', sku: 'P-999', price: 10, unknownField: true })
      .expect(400);
  });

  it('GET /products — should list all products including seeded', async () => {
    const res = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(res.body).toHaveLength(initialCount + 1);
    expect(res.body.find((p: any) => p.sku === 'P-001')).toBeDefined();
  });

  it('GET /products/:id — should return a product by ID', async () => {
    const res = await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(200);

    expect(res.body.name).toBe('Camiseta Básica');
  });

  it('GET /products/:id — should return 404 for non-existent product', async () => {
    await request(app.getHttpServer())
      .get('/products/non-existent-id')
      .expect(404);
  });

  it('PATCH /products/:id — should partially update a product', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/products/${productId}`)
      .send({ price: 59.9 })
      .expect(200);

    expect(res.body.price).toBe(59.9);
    expect(res.body.name).toBe('Camiseta Básica');
  });

  it('DELETE /products/:id — should delete a product', async () => {
    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(204);

    await request(app.getHttpServer())
      .get(`/products/${productId}`)
      .expect(404);
  });
});
