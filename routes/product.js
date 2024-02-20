// [SECTION] Dependencies and Modules
const express = require("express");
const productController = require("../controllers/product");
const auth = require("../auth");
const multer = require('multer');
const path = require('path');

const { verify, verifyAdmin } = auth;

// [SECTION] Routing Component
const router = express.Router();

// [ROUTES]
// Session 50
// Route for creating a new product
router.post("/create", verify, verifyAdmin, productController.addProduct);
// Route for retrieving ALL the product
router.get("/all", productController.getAllProducts);
// Route for retrieving all ACTIVE product
router.get("/active", productController.getAllActive);

// Session 51
// Route for retrieving a specific product
router.get("/:productId", productController.getProduct);
// Route for updating a product (Admin)
router.put("/:productId", verify, verifyAdmin, productController.updateProduct);
// Route for archiving a product (Admin)
router.put("/:productId/archive", verify, verifyAdmin, productController.archiveProduct); 
// Route for activating a product (Admin)
router.put("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Route for searching by product name
router.post('/searchProduct', productController.searchProductsByName);
// Route for get email of ordered users
router.get('/:productId/ordered-users', productController.getEmailsOfOrderUsers);
// Route for searching product by price range
router.post("/search", productController.searchProductsByPriceRange);
// Delete a product by ID
router.delete('/:productId', verify, productController.deleteProduct);

router.post('/:productId/checkout', verify, productController.checkoutProduct);

module.exports = router;
