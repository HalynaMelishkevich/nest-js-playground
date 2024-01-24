import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let appController: ProductsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    appController = app.get<ProductsController>(ProductsController);
  });

  describe('Products', () => {
    it('should return a list of products', () => {
      expect(appController.getProducts()).toEqual([]);
    });
  });
});
