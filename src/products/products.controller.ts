import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { ProductsService } from './products.service';

import { Product } from './product.model';

import { ResponseMessage } from '../utils/constants';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post()
  addProduct(
    @Body('title') productTitle: string,
    @Body('description') productDescription: string,
    @Body('price') productPrice: number,
  ): Product {
    const productId = this.productsService.insertProduct(
      productTitle,
      productDescription,
      productPrice,
    );

    return {
      id: productId,
    };
  }

  @Get()
  getProducts(): Product[] {
    return this.productsService.getProducts();
  }

  @Get(':id')
  getProduct(@Param('id') productId: string) {
    const product = this.productsService.getProduct(productId);
    if (product) {
      return product;
    } else {
      throw new NotFoundException(ResponseMessage.PRODUCT_NOT_FOUND);
    }
  }

  @Patch(':id')
  updateProduct(
    @Param('id') productId: string,
    @Body('title') productTitle: string,
    @Body('description') productDescription: string,
    @Body('price') productPrice: number,
  ) {
    const updateResult = this.productsService.updateProduct(
      productId,
      productTitle,
      productDescription,
      productPrice,
    );
    if (updateResult !== null) {
      return {
        message: ResponseMessage.SUCCESSFUL_UPDATE,
      };
    } else {
      throw new NotFoundException(ResponseMessage.PRODUCT_NOT_FOUND);
    }
  }

  @Delete(':id')
  deleteProduct(@Param('id') productId: string) {
    const deleteResult = this.productsService.deleteProduct(productId);
    if (deleteResult !== null) {
      return {
        message: ResponseMessage.SUCCESSFUL_DELETE,
      };
    } else {
      throw new NotFoundException(ResponseMessage.PRODUCT_NOT_FOUND);
    }
  }
}
