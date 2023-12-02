const express = require("express");
const tokenMajors = require("../config/jwt");
const orderControllers = require("../controllers/orderControllers");

const orderRouter = express.Router();

orderRouter
  .route("/create/:food_id")
  .post(tokenMajors.verifyToken, orderControllers.create);

module.exports = orderRouter;
