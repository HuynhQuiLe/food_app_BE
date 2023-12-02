const express = require("express");
const rateControllers = require("../controllers/rateControllers");
const tokenMajors = require("../config/jwt");
const rateRouter = express.Router();

rateRouter
  .route("/create/:res_id")
  .post(tokenMajors.verifyToken, rateControllers.create);

rateRouter
  .route("/get-rates-by-res/:res_id")
  .get(rateControllers.getRatesByRes);

rateRouter
  .route("/get-rates-by-user/:user_id")
  .get(rateControllers.getRatesByUser);

module.exports = rateRouter;
