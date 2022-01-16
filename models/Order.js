const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product",
    },
    price: Number,
    count: Number,
    name: String,
});

const ProductCart = mongoose.model("ProductCart", productCartSchema);

const orderSchema = new mongoose.Schema({
    products: [productCartSchema],
    amount: {
        type: Number,
    },
    address: String,
    transaction_id: {},
    user: {
        type: ObjectId,
        ref: "User",
    },
    updated: Date,
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order, ProductCart };
