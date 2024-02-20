const mongoose = require('mongoose');
const Checkout = require('../models/Checkout');
const Order = require('../models/Order');
const Product = require('../models/Product');

async function placeOrder(req, res) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, products, orderId } = req.body;

    // Calculate totalAmount based on the provided subtotal
    const totalAmount = calculateTotal(products);

    const newCheckout = new Checkout({
      userId,
      products,
      totalAmount,
      orderId,
    });

    // Update product inventory
    await updateProductInventory(products);

    // Remove only the selected items from the order
    await updateOrder(orderId, products, session);

    // Save newCheckout and update totalAmount in one operation
    await newCheckout.save({ session });

    await session.commitTransaction();

    res.json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error during order placement:', error);
    res.status(500).json({ success: false, message: 'Order placement failed', error: error.message });
  } finally {
    session.endSession();
  }
}

function calculateTotal(products) {
  try {
    const totalAmount = products.reduce((total, product) => {
      if (product.productDetails && product.productDetails.price && product.quantity) {
        return total + product.productDetails.price * product.quantity;
      } else {
        console.error('Invalid product structure:', product);
        return total;
      }
    }, 0);

    return totalAmount;
  } catch (error) {
    console.error('Error during total calculation:', error);
    throw new Error('Total calculation failed');
  }
}


async function updateOrder(orderId, selectedProducts, session) {
  try {
    const productIdsToRemove = selectedProducts.map(product => product._id);

    // Remove the selected products from the order
    await Order.updateOne(
      { _id: orderId },
      { $pull: { products: { productId: { $in: productIdsToRemove } } } },
      { session }
    );
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error('Failed to update order');
  }
}

async function updateProductInventory(products) {
  try {
    for (const product of products) {
      const productId = product._id; // Use _id instead of productId
      const quantityToDecrease = product.quantity;

      // Update the product quantity directly in the database
      await Product.updateOne(
        { _id: productId, quantity: { $gte: quantityToDecrease } },
        { $inc: { quantity: -quantityToDecrease } }
      );
    }
  } catch (error) {
    console.error('Error updating product inventory:', error);
    throw new Error('Failed to update product inventory');
  }
}


async function getCheckouts(req, res) {
  try {
    // Fetch all checkout records from the database
    const checkouts = await Checkout.find();

    // Send the checkouts data in the response
    res.json({ success: true, data: checkouts });
  } catch (error) {
    console.error('Error fetching checkouts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch checkouts', error: error.message });
  }
}



module.exports = { placeOrder, getCheckouts };
