import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ProductsModule } from '../src/products/products.module';
import { ResponseMessage } from '../src/utils/constants';
import { faker } from '@faker-js/faker';

describe('ProductsController (e2e)', () => {
  let productId, product, updatedProduct;

  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    product = {
      title: faker.lorem.sentence(3),
      description: faker.lorem.sentence(3),
      price: faker.number.float({ min: 3, max: 100 }),
    };
    updatedProduct = {
      title: faker.lorem.sentence(3),
      description: faker.lorem.sentence(3),
      price: faker.number.float({ min: 3, max: 100 }),
    };
  });

  afterEach(() => {
    productId = undefined;
  });

  describe('Success:', () => {
    it('/products (GET)', () => {
      request(app.getHttpServer()).get('/products').expect(200).expect([]);
    });

    it('/products (POST)', () => {
      request(app.getHttpServer())
        .post('/products/')
        .send(product)
        .expect(201)
        .expect((response) => {
          expect(response.body.id).toBeDefined();

          productId = response.body.id;
        });

      request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .expect([
          {
            id: productId,
            ...product,
          },
        ]);
    });

    it('/products/:id (GET)', () => {
      request(app.getHttpServer())
        .post('/products/')
        .send(product)
        .expect(201)
        .expect((response) => {
          expect(response.body.id).toBeDefined();

          productId = response.body.id;
        });

      request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200)
        .expect({
          id: productId,
          ...product,
        });
    });

    it('/products/:id (PATCH)', () => {
      request(app.getHttpServer())
        .post('/products/')
        .send(product)
        .expect(201)
        .expect((response) => {
          expect(response.body.id).toBeDefined();

          productId = response.body.id;
        });

      request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send(updatedProduct)
        .expect(200)
        .expect({
          id: productId,
          ...product,
        });

      request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200)
        .expect({
          id: productId,
          ...updatedProduct,
        });
    });

    it('/products/:id (DELETE)', () => {
      request(app.getHttpServer())
        .post('/products/')
        .send(product)
        .expect(201)
        .expect((response) => {
          expect(response.body.id).toBeDefined();

          productId = response.body.id;
        });

      request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(200)
        .expect({
          id: productId,
          ...product,
        });

      request(app.getHttpServer()).get(`/products/${productId}`).expect(404);
    });
  });

  describe('Failure:', () => {
    it('/products/:id (GET). Product does not exist', () => {
      return request(app.getHttpServer())
        .get('/products/1')
        .expect(404)
        .expect({
          message: ResponseMessage.PRODUCT_NOT_FOUND,
          error: 'Not Found',
          statusCode: 404,
        });
    });

    it('/products/:id (PATCH). Product does not exist', () => {
      return request(app.getHttpServer())
        .patch('/products/1')
        .send({})
        .expect(404)
        .expect({
          message: ResponseMessage.PRODUCT_NOT_FOUND,
          error: 'Not Found',
          statusCode: 404,
        });
    });

    it('/products/:id (DELETE). Product does not exist', () => {
      return request(app.getHttpServer())
        .delete('/products/1')
        .expect(404)
        .expect({
          message: ResponseMessage.PRODUCT_NOT_FOUND,
          error: 'Not Found',
          statusCode: 404,
        });
    });
  });
});
