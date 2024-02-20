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
mongoose.connect("mongodb+srv:this is secret ^_^ ", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => console.log("Now connected to MongoDB Atlas."));

// [SECTION] Backend Routes
app.use("/b6/users", userRoutes);
app.use("/b6/products", productRoutes); 
app.use("/b6/orders", orderRoutes);
app.use("/b6/checkouts", checkoutRoutes);

// Server Gateway Response
if (require.main === module) {
  app.listen(port, () => {
    console.log(`API is now online on port ${port}`);
  });
}

module.exports = { app, mongoose };
