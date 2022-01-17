const User = require("../models/user");

exports.signup = (req, res) => {
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

exports.signout = (req, res) => {
    res.send("signout page through controller");
}