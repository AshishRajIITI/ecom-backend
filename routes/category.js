const express = require('express');
const router = express.Router();

const {getCategoryById} = require("../controllers/category");
const {getUserById} = require("../controllers/user");
const {isAdmin, isAuthenticated, isSignedIn} = require("../controllers/auth");

router.param("categoryId", getCategoryById);
router.param("userId", getUserById);


module.exports = router;