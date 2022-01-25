const Category = require("../models/category");


exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, eachCategory) => {
        if (err) {
            return res.status(400).json({
                error: "Category with given categoryId no found!"
            })
        }
        req.category = eachCategory;
        next();
    })
}

exports.getCategory = (req, res) =>{
    
}