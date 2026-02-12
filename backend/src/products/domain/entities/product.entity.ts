export class Product {
  id: string;
  name: string;
  sku: string;
  price: number;

  constructor(params: { id: string; name: string; sku: string; price: number }) {
    this.id = params.id;
    this.name = params.name;
    this.sku = params.sku;
    this.price = params.price;
  }
}
