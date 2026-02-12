import { OrderItem } from './order-item.entity';

export class Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  createdAt: Date;

  constructor(params: {
    id: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    totalAmount: number;
    createdAt: Date;
  }) {
    this.id = params.id;
    this.customerName = params.customerName;
    this.customerEmail = params.customerEmail;
    this.items = params.items;
    this.totalAmount = params.totalAmount;
    this.createdAt = params.createdAt;
  }
}
