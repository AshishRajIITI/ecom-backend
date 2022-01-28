const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getProductById, getProduct, photo, getAllProducts, createProduct, removeProduct, updateProduct, getAllCategories } = require("../controllers/product");

//param routes
router.param("userId", getUserById);
router.param("productId", getProductById);

//get Routes
router.get("/product/:productId", getProduct);
//why this route??
router.get("/product/photo/:productId", photo);

//get all products (no requirement oof signin)
router.get("/products", getAllProducts);
router.get("/products/categories", getAllCategories);


//create a Product
router.post("/product/create/:userId", isSignedIn, isAuthenticated, isAdmin, createProduct);

//delete a product
router.delete("/product/:userId/:productId", isSignedIn, isAuthenticated, isAdmin, removeProduct);

//update a product
router.put("/product/:userId/:productId", isSignedIn, isAuthenticated, isAdmin, updateProduct);


module.exports = router;