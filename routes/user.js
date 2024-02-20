// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user");
const auth = require("../auth");

// Destructure the verify and verifyAdmin from auth
// You can still use auth.verify, auth.verifyAdmin if you don't want destructuring
const { verify, verifyAdmin } = auth;

// [SECTION] Routing Component
const router = express.Router();

// [SECTION] Routes
// Session 49
// Route for checking if the user's email already exist in the database
router.post("/checkEmail", (req, res) => {
  userController.checkEmailExists(req.body).then((resultFromController) => res.send(resultFromController));
});

// Route for user registration
router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
})
// Route for user Authentication
router.post("/login", userController.loginUser);



// Session 52
// Route for getting user Profile
router.get("/details", verify, userController.getProfile);



// Route for all user can reset their password
router.put("/reset-password", verify, userController.resetPassword);
// Route for updating the profile (admin only)
router.put("/profile", verify, userController.updateProfile);


// STRETCH GOAL
// Route for updating user account to admin account
router.put("/setAsAdmin", verify, verifyAdmin, userController.updateToAdmin);
// Route for updating admin account to user account
router.put("/setToUser", verify, verifyAdmin, userController.updateToUser);
// Route for retrieving all orders(admin only)
router.get("/getAllOrders", verify, userController.getAllOrders);
// Route for get all the ordered products of a user (admin only)
router.get("/getOrders", verify, userController.getAllOrdersForUser);
// Route for get all the checkouts products of a user (admin only)
router.get('/getAllCheckouts', verify, verifyAdmin, userController.getAllCheckouts);
// Route for gell all user for user management in frontend later
router.get("/getAllUsers", verify, verifyAdmin, userController.getAllUsers);

router.put("/editUser/:userId", verify, verifyAdmin, userController.editUser);

router.get('/getUser/:userId', verify, verifyAdmin, userController.getUserById);

router.delete("/deleteUser/:userId", verify, verifyAdmin, userController.deleteUser);
// [SECTION] Export Route System
module.exports = router;