const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkout');
const auth = require("../auth");

const { verify } = auth;

// POST /checkouts/placeOrder
router.post('/', verify, checkoutController.placeOrder);
// GET checkout products
router.get('/', verify, checkoutController.getCheckouts);

module.exports = router;
