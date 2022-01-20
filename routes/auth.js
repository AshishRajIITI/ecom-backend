var express = require('express');
var router = express.Router();
const User = require("../models/user");
const { body, validationResult, check } = require('express-validator');
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");

router.post("/signup",
    body('name').isLength({ min: 3 }).withMessage('name should be at least 3 characters long'),
    body('email').isEmail().withMessage("email is not correct"),
    body('password')
        .isLength({ min: 5 })
        .withMessage('must be at least 5 chars long')
        .matches(/\d/)
        .withMessage('must contain a number')
    , signup);

router.post("/signin",
    body('email').isEmail().withMessage("Email is not correct"),
    body('password')
        .isLength({ min: 1 })
        .withMessage('please write password')
    , signin);


router.get("/signout", signout);
router.get("/testroute", isSignedIn, (req, res)=>{
    if(!req.auth){
        return res.status(402).send("you are not a protected route");
    }
    return res.send("yes you are signed in");
});

module.exports = router;



