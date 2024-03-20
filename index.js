// Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const checkoutRoutes = require("./routes/checkout");

// Environment setup
const port = 4006;

// Server setup
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Database connection
mongoose.connect("mongodb+srv://raymondregoso:admin123@cluster0.tzc7fco.mongodb.net/capstone_2?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas."));

// [SECTION] Backend Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes); 
app.use("/orders", orderRoutes);
app.use("/checkouts", checkoutRoutes);

// Server Gateway Response
if (require.main === module) {
  app.listen(port, () => {
    console.log(`API is now online on port ${port}`);
  });
}

module.exports = { app, mongoose };
