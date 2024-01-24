import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Product } from './product.model';

@Injectable()
export class ProductsService {
  products: Product[] = [];

  insertProduct(title: string, description: string, price: number): string {
    const productId = uuidv4();
    const newProduct = new Product(productId, title, description, price);
    this.products.push(newProduct);

    return productId;
  }

  getProducts(): Product[] {
    return [...this.products];
  }

  getProduct(id: string): Product {
    return this.products.find((product) => product.id === id);
  }

  updateProduct(
    id: string,
    title: string,
    description: string,
    price: number,
  ): number {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );
    if (productIndex === -1) return null;

    const product = this.products[productIndex];

    if (title) {
      product.title = title;
    }
    if (description) {
      product.description = description;
    }
    if (price) {
      product.price = price;
    }
    this.products[productIndex] = product;

    return productIndex;
  }

  deleteProduct(id: string): number {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );
    if (productIndex === -1) return null;

    this.products.splice(productIndex, 1);

    return productIndex;
  }
}
