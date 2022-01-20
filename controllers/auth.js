const User = require("../models/user");
const { body, validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                err: "NOT able to save the user to the database"
            });
        }
        res.json({
            name: user.email,
            email: user.email,
            id: user._id,
        });
    })
}

exports.signin = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()[0].msg });
    }

    User.findOne({ email }, (err, user) => {
        if (err) {
            return res.status(400).json({
                err: "ERROR in finding user"
            });
        }
        if (!user) {
            return res.status(400).json({
                err: "ERROR in finding user with provided email"
            });
        }
        if (!user.authenticate(password)) {
            return res.status(402).json({
                err: "Wrong password provided"
            });
        }

        //create token
        const token = jwt.sign({ _id: user._id }, process.env.TOKENPASSWORD);
        //put token in cookie
        res.cookie("token", token, { expire: new Date() + 9999 });

        //send response to front end
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, name, email, role } });
    })
}

exports.signout = (req, res) => {
    res.clearCookie("token");
    return res.send("You are suceesfully signed out");
}


//protected routing
exports.isSignedIn = expressJwt({
    secret: process.env.TOKENPASSWORD,
    requestProperty: 'auth',
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id === req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
}

//is admin check
exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "You are not ADMIN, Access denied"
        });
    }
    next();
}