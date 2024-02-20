const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

module.exports.addToOrder = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find the product to add to the order
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Find or create the user's order
    let order = await Order.findOne({ userId });

    if (!order) {
      order = new Order({
        userId,
        products: [],
        totalAmount: 0, // Initialize totalAmount to 0
      });
    }

    // Ensure that the products array is defined
    if (!order.products) {
      order.products = [];
    }

    // Check if the product is already in the order
    const existingProductIndex = order.products.findIndex((p) => p.productId.equals(productId));

    if (existingProductIndex !== -1) {
      // Update the quantity if the product is already in the order
      order.products[existingProductIndex].quantity += quantity;
    } else {
      // Add the product to the order if it's not already there
      order.products.push({ productId, quantity, productDetails: { name: product.name, price: product.price } });
    }

    // Calculate total amount based on the products in the order
    order.totalAmount = order.products.reduce((total, product) => {
      return total + (product.quantity || 0) * (product.productDetails.price || 0);
    }, 0);

    // Save the updated order
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.error("Error in addToOrder:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

module.exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Find or create the user's cart
    let cart = await Order.findOne({ userId });

    if (!cart) {
      cart = new Order({
        userId,
        products: [],
        totalAmount: 0,
      });
    }

    // Ensure that the products array is defined
    if (!cart.products) {
      cart.products = [];
    }

    // Check if the product is already in the cart
    const existingProductIndex = cart.products.findIndex((p) => p.productId.equals(productId));

    if (existingProductIndex !== -1) {
      // Update the quantity if the product is already in the cart
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Add the product to the cart if it's not already there
      cart.products.push({
        productId,
        quantity,
        productDetails: { name: product.name, price: product.price },
      });
    }

    // Calculate total amount based on the products in the cart
    cart.totalAmount = cart.products.reduce((total, product) => {
      return total + (product.quantity || 0) * (product.productDetails.price || 0);
    }, 0);

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

module.exports.updateCartItem = async (req, res) => {
  try {
    const { userId } = req.body;
    const productId = req.params.productId;
    const newQuantity = req.body.quantity;

    // Find the user's cart
    let cart = await Order.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    // Find the product in the cart
    const existingProductIndex = cart.products.findIndex((p) => p.productId.equals(productId));

    if (existingProductIndex !== -1) {
      // Update the quantity of the product in the cart
      cart.products[existingProductIndex].quantity = newQuantity;

      // Recalculate total amount based on the updated quantities
      cart.totalAmount = cart.products.reduce((total, product) => {
        return total + (product.quantity || 0) * (product.productDetails.price || 0);
      }, 0);

      // Save the updated cart
      await cart.save();

      res.status(200).json(cart);
    } else {
      return res.status(404).json({ error: "Product not found in the cart." });
    }
  } catch (error) {
    console.error("Error in updateCartItem:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

module.exports.removeCartItem = async (req, res) => {
  try {
    const { userId } = req.body;
    const productId = req.params.productId;

     console.log(`Removing product ${productId} from cart for user ${userId}`);
    // Find the user's cart
    let cart = await Order.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter((p) => !p.productId.equals(productId));

    // Recalculate total amount based on the updated products
    cart.totalAmount = cart.products.reduce((total, product) => {
      return total + (product.quantity || 0) * (product.productDetails.price || 0);
    }, 0);

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in removeCartItem:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

module.exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's cart
    const cart = await Order.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in getCart:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

module.exports.calculateSubtotalAndTotal = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find the user's cart
    const cart = await Order.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    // Calculate subtotal for each item
    const itemsWithSubtotal = cart.products.map((product) => {
      const subtotal = (product.quantity || 0) * (product.productDetails.price || 0);
      return { ...product.toObject(), subtotal };
    });

    // Calculate total price for all items
    const totalPrice = itemsWithSubtotal.reduce((total, item) => total + item.subtotal, 0);

    res.status(200).json({ itemsWithSubtotal, totalPrice });
  } catch (error) {
    console.error("Error in calculateSubtotalAndTotal:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

