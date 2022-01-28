const express = require("express");
const router = express.Router();


const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById, updateOrderInPurchaseList } = require("../controllers/user");
const { updateStock } = require("../controllers/product");
const { getOrderById, createOrder, getAllOrders, updateOrderStatus, getOrderStatus } = require("../controllers/order");

router.param("orderId", getOrderById);
router.param("userId", getUserById);


//creating a order!
router.post("/order/create/:userId", isSignedIn, isAuthenticated, updateOrderInPurchaseList, updateStock, createOrder);

//getting all orders1
router.get("/order/all/:userId", isSignedIn, isAuthenticated, isAdmin, getAllOrders);

//get status
router.get("/order/status/:orderId/:userId", isSignedIn, isAuthenticated, isAdmin, getOrderStatus);

//updateStatus
router.put("/order/status/:orderId/:userId", isSignedIn, isAuthenticated, isAdmin, updateOrderStatus);




module.exports = router;
