import mongoose from 'mongoose';
import { Order } from './types/orderTypes';

const Schema = mongoose.Schema;

const orderSchema = new Schema<Order>({
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true }
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
});

module.exports = mongoose.model('Order', orderSchema);
