require("dotenv").config();


//importing routes;
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");


const mongoose = require("mongoose");
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


//DB CONNECTION
mongoose
  .connect(process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch(() => {
    console.log("THERE'S AN ERROR IN DB CONNECTION")
  });


//MIDDLEWARE
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());


//ROUTES
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);


//PORT
const port = process.env.PORT || 8000;

//STARTING THE SERVER BY LISTENING TO THE PORT
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
