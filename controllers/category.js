const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, eachCategory) => {
        if (err) {
            return res.status(400).json({
                error: "Category with given categoryId not found!"
            })
        }
        req.category = eachCategory;
        next();
    })
}

exports.getCategory = (req, res) => {
    return res.json(req.category);
}

exports.getAllCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err) {
            return res.status(400).json({
                error: "Categories list not found!"
            })
        }

        return res.json(categories);
    });
}


exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, category) => {
        if (err) {
            return res.status(400).json({
                error: "NOT able to save category in DB"
            });
        }
        res.json(category);
    });
}

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;

    category.save((err, updatedCategory) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to update category"
            });
        }
        res.json(updatedCategory);
    });

}

exports.removeCategory = (req, res) => {
    const category = req.category;

    category.remove((err, deletedCategory) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to update category"
            });
        }
        res.json({
            message: "Successfully deleted!"
        });
    })

}