const mongoose = require('mongoose');
const { Schema } = mongoose;

const modelName = 'Checkout';

let Checkout;

try {
  // Try to get the existing model to avoid OverwriteModelError
  Checkout = mongoose.model(modelName);
} catch (error) {
  // Define the model if it doesn't exist
  Checkout = mongoose.model(modelName, new Schema({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    products: {
      type: Schema.Types.Mixed,
      required: true
    },
    totalAmount: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }));
}

module.exports = Checkout;
