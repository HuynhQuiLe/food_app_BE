const express = require("express");
const likeRouter = require("./likeRouter");
const authRouter = require("./authRouter");
const rateRouter = require("./rateRouter");
const orderRouter = require("./orderRouter");

const rootRouter = express.Router();

rootRouter.use("/auth", authRouter);

rootRouter.use("/like", likeRouter);

rootRouter.use("/rate", rateRouter);

rootRouter.use("/order", orderRouter);

module.exports = rootRouter;
