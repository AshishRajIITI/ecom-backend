const { Order, ProductCart } = require("../models/Order");


exports.getOrderById = (req, res, next, id) => {
    Order.findById(id)
        .populate("products.product", "name order")
        .exec((err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "Order with this orderId not found!"
                })
            }
            req.order = order;
            next();
        })
}

exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;

    const order = new Order(req.body.order);

    order.save((err, order) => {
        if (err) {
            return res.status(400).json({
                error: "Order failed to be created!"
            })
        }
        res.json(order);
    })

}

exports.getAllOrders = (req, res) => {
    Order.find()
        .populate("user", "name _id")
        .exec((err, orders) => {
            if (err) {
                return res.status(400).json({
                    error: "Fetching Orders from the DB failed!"
                })
            }
            res.json(orders);
        })
}

exports.updateOrderStatus = (req, res) => {
    Order.findOneAndUpdate(
        { _id: req.body.orderId },
        { $set: { status: req.body.status } },
        (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: "Updating Order status failed!"
                })
            }
            res.json(order);
        }
    )
}

exports.getOrderStatus = (req, res) => {
    //DOUBT
    return res.json(Order.schema.path("status").enumValues);
}