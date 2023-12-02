const express = require("express");
const likeControllers = require("../controllers/likeControllers");
const tokenMajors = require("../config/jwt");
const likeRouter = express.Router();

likeRouter
  .route("/:res_id")
  .post(tokenMajors.verifyToken, likeControllers.like);

likeRouter
  .route("/get-likes-by-res/:res_id")
  .get(likeControllers.getLikesByRes);
likeRouter
  .route("/get-likes-by-user/:user_id")
  .get(likeControllers.getLikesByUser);

module.exports = likeRouter;
