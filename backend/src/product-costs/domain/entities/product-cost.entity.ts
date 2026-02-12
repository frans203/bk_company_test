export class ProductCost {
  id: string;
  productId: string;
  cost: number;

  constructor(params: { id: string; productId: string; cost: number }) {
    this.id = params.id;
    this.productId = params.productId;
    this.cost = params.cost;
  }
}
