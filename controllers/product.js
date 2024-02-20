// Dependencies
const Product = require("../models/Product");
const User = require("../models/User");
const path = require('path');

module.exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
    });

    // Save the product to the database
    await newProduct.save();

    return res.status(201).json({ success: true, message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);

    // Send a more informative error response
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

module.exports.getAllProducts = (req, res) => {
  Product.find({})
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.error('Error fetching all products:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    });
};

module.exports.getAllActive = (req, res) => {
  Product.find({ isActive: true })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.error('Error fetching active products:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    });
};

module.exports.getProduct = (req, res) => {
  Product.findById(req.params.productId)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      console.error('Error fetching product by ID:', error.message);
      res.status(500).json({ message: 'Internal Server Error' });
    });
};

module.exports.updateProduct = (req, res) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
  };

  Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(() => {
      res.send(true);
    })
    .catch((error) => {
      console.error('Error updating product:', error.message);
      res.send(false);
    });
};

module.exports.archiveProduct = (req, res) => {
  const updateActiveField = {
    isActive: false,
  };

  Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then(() => {
      res.send(true);
    })
    .catch((error) => {
      console.error('Error archiving product:', error.message);
      res.send(false);
    });
};

module.exports.activateProduct = (req, res) => {
  const updateActiveField = {
    isActive: true,
  };

  Product.findByIdAndUpdate(req.params.productId, updateActiveField)
    .then(() => {
      res.send(true);
    })
    .catch((error) => {
      console.error('Error activating product:', error.message);
      res.send(false);
    });
};

module.exports.searchProductsByName = async (req, res) => {
  try {
    const { productName } = req.body;
    const products = await Product.find({
      name: { $regex: productName, $options: 'i' },
    });
    res.json(products);
  } catch (error) {
    console.error('Error searching products by name:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.getEmailsOfOrderUsers = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const userIds = product.orders.map((order) => order.userId);
    const orderedUsers = await User.find({ _id: { $in: userIds } });
    const userEmails = orderedUsers.map((user) => user.email);

    res.status(200).json({ userEmails });
  } catch (error) {
    console.error('Error retrieving ordered users:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.searchProductsByPriceRange = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;

    if (!minPrice || !maxPrice) {
      return res.status(400).json({ message: 'Both minPrice and maxPrice are required' });
    }

    const products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error searching products by price range:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.checkoutProduct = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: 'Not enough inventory' });
    }

    // Process checkout and update product quantity
    product.quantity -= quantity;
    await product.save();

    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Error during checkout:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log('Deleting product with ID:', productId);

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      console.log('Product not found for deletion.');
      return res.status(404).json({ error: 'Product not found.' });
    }

    console.log('Product deleted:', deletedProduct);
    res.status(200).json(deletedProduct);
  } catch (error) {
    console.error('Error deleting product by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
