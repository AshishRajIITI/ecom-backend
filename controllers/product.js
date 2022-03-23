const Product = require("../models/product");

const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.getProductById = (req, res, next, id) => {
    Product.findById(id)
        .populate("category")//important
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Product with this productId not found!"
                })
            }
            req.product = product;
            next();
        })
}

exports.getProduct = (req, res) => {
    //why below line
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.photo = (req, res, next) => {
    //WHY BELOW CODE
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortby = req.query.sortby ? req.query.sortby : "_id";
    Product
        .find()
        .populate("category")
        .select("-photo")
        .sort([[sortby, "asc"]])
        .limit(limit)
        .exec((err, allProducts) => {
            if (err) {
                return res.status(400).json({
                    error: "No products found on allProducts search!"
                })
            }

            return res.json(allProducts);
        })

}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            console.log(err);
            return res.status(400).json({
                error: "problem with image"
            });
        }
        //destructure the fields
        const { name, description, price, category, stock } = fields;

        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({
                error: "Please include all fields"
            });
        }

        // console.log(fields);
        let product = new Product(fields);

        //handle photo here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }

        //save to the DB
        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Saving tshirt in DB failed"
                });
            }
            res.json(product);
        });
    });
};

exports.removeProduct = (req, res) => {
    let product = req.product;

    product.remove((err, removedProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete the product"
            });
        }
        return res.json({
            message: "Deletion was a success",
        });
    })

}

// update tshirt controllers
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: "problem with image"
            });
        }

        //updation code
        console.log("body", req.body);
        console.log("product", req.product);
        console.log("data", req.data);

        let product = req.product;
        product = _.extend(product, fields);

        //handle file here
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: "File size too big!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
        }
        console.log(product);

        //save to the DB
        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Updation of product failed"
                });
            }
            return res.json(product);
        });
    });

}

//update controllers
exports.updateStock = (req, res, next) => {

    //TODO: doubt
    let myOperations = req.body.order.products.map((product) => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: { stock: -product.count, sold: +product.count } }
            }
        }
    })

    //TODO:
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "BulkWrite error!"
            });
        }

        next();
    });

}

exports.getAllCategories = (req, res) => {
    //TODO: distinct?
    Product.distinct("categories", {}, (err, category) => {
        if (err) {
            return res.status(400).json({
                error: "getAllCategories error!"
            });
        }
        res.json(category);
    })
}