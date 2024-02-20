const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    unique: true,
    required: true,
    default: () => new mongoose.Types.ObjectId().toString() // Auto-generate ObjectId as String
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      productDetails: {
        name: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        }
      }
    }
  ],
  totalAmount: {
    type: Number,
    default: 0
  },
  purchasedOn: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model('Order', orderSchema);