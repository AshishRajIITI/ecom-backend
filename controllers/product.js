const Product = require("../models/product");

const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.getProductById = (req, res, next, id) => {

    Product.findById(id)
        .populate("category") //DOUBT: why this
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: "Product with this productId not found!"
                })
            }
            req.product = product;
            next()
        })
}

exports.getProduct = (req, res) => {
    //why below line
    req.product.photo = undefined;
    return res.json(req.product);
}

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if (err) {
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

        console.log(fields);
        let product = new Product(fields);

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

exports.photo = (req, res, next) => {
    //WHY BELOW CODE
    if (req.product.photo.data) {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
}

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
            deletedProduct
        });
    })

}

exports.removeProduct = (req, res) => {

    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: "Failed to delete the product"
            });
        }
        res.json({
            message: "Deletion was a success",
            deletedProduct
        });
    });
};

// delete controllers
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
        // console.log(product);

        //save to the DB
        product.save((err, product) => {
            if (err) {
                res.status(400).json({
                    error: "Updation of product failed"
                });
            }
            res.json(product);
        });
    });

}