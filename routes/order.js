const express = require("express");
const orderController = require("../controllers/order");
const router = express.Router();
const auth = require("../auth");

const { verify } = auth;

// Session 52
// Add products to the user's order
router.post("/addToOrder", verify, orderController.addToOrder);

// Stretch Goal

// Add products to the user's cart
router.post("/addToCart", verify, orderController.addToCart);

// Update product quantity in the user's cart
router.put("/updateCartItem/:productId", verify, orderController.updateCartItem);

// Remove product from the user's cart
router.delete("/removeCartItem/:productId", verify, orderController.removeCartItem);

// Get the user's cart details
router.get("/getCart", verify, orderController.getCart);

// Calculate subtotal for each item and total price for all items
router.get("/calculateSubtotalAndTotal", verify, orderController.calculateSubtotalAndTotal);


module.exports = router;
