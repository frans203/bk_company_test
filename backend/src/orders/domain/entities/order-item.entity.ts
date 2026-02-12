export class OrderItem {
  productSku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;

  constructor(params: {
    productSku: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }) {
    this.productSku = params.productSku;
    this.productName = params.productName;
    this.quantity = params.quantity;
    this.unitPrice = params.unitPrice;
    this.subtotal = params.quantity * params.unitPrice;
  }
}
