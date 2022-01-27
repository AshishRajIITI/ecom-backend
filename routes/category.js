const express = require('express');
const router = express.Router();

const {
    getCategoryById,
    getCategory,
    getAllCategories,
    createCategory,
    updateCategory,
    removeCategory
} = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const { isAdmin, isAuthenticated, isSignedIn } = require("../controllers/auth");

//param
router.param("categoryId", getCategoryById);
router.param("userId", getUserById);

//get routes
router.get("/category/:categoryId", getCategory);
router.get("/category", getAllCategories);

//create a category
router.post("/category/create/:userId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    createCategory
);

//update a category
router.put("/category/:userId/:categoryId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    updateCategory
);

//delete a category
router.delete("/category/:userId/:categoryId",
    isSignedIn,
    isAuthenticated,
    isAdmin,
    removeCategory
);

module.exports = router;