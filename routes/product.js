const express = require("express");
const router = express.Router();

const { getUserById } = require("../controllers/user");
const { getProductById, getProduct, photo, createProduct, removeProduct, updateProduct } = require("../controllers/product");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

//param routes
router.param("userId", getUserById);
router.param("productId", getProductById);

//get Routes
router.get("/product/:productId", getProduct);
//why this route??
router.get("/product/photo/:productId", photo);

//create a Product
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);

//delete a product
router.delete("/product/:userId/:productId", isSignedIn, isAuthenticated, isAdmin, removeProduct);

//update a product
router.put("/product/:userId/:productId", isSignedIn, isAuthenticated, isAdmin, updateProduct);


module.exports = router;