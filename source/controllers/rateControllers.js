const tokenMajors = require("../config/jwt");
const responseData = require("../config/response");

const initModels = require("../models/init-models");
const sequelize = require("../models/connect");

const model = initModels(sequelize);

const rateControllers = {
  create: async (req, res) => {
    try {
      const { res_id } = req.params;
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;
      const { amount } = req.body;

      // check nhà hàng tồn tại hay không
      const restaurant = await model.restaurant.findOne({ where: { res_id } });
      if (!restaurant) {
        return responseData(res, "Không tìm thấy nhà hàng.", null, 404);
      }

      //   check người dùng đã từng đánh giá chưa
      const rated = await model.rate_res.findOne({
        where: { res_id, user_id },
      });
      if (rated) {
        return responseData(
          res,
          "Bạn đã đánh giá nhà hàng rồi - không thể đánh giá nữa.",
          null,
          409
        );
      }

      const rate = {
        res_id,
        user_id,
        amount,
        date_rate: new Date(),
      };

      await model.rate_res.create(rate);
      responseData(
        res,
        `Bạn đã đánh giá nhà hàng ${restaurant.res_name} thành công .`,
        null,
        201
      );
    } catch (error) {
      responseData(
        res,
        "Đã có lỗi xảy ra - không thể tạo bình luận.",
        null,
        400
      );
    }
  },
  getRatesByRes: async (req, res) => {
    try {
      const { res_id } = req.params;
      // check nhà hàng tồn tại hay không
      const restaurant = await model.restaurant.findOne({ where: { res_id } });
      if (!restaurant) {
        return responseData(res, "Không tìm thấy nhà hàng.", null, 404);
      }

      const rates = await model.rate_res.findAll({
        where: { res_id },
        include: ["user", "re"],
      });
      responseData(
        res,
        "Lấy danh sách đánh giá theo nhà hàng thành công.",
        rates,
        200
      );
    } catch (error) {
      responseData(
        res,
        "Đã có lỗi xảy ra - không thể lấy danh sách đánh giá theo nhà hàng.",
        null,
        400
      );
    }
  },
  getRatesByUser: async (req, res) => {
    const { user_id } = req.params;
    // check nhà hàng tồn tại hay không
    const user = await model.users.findOne({ where: { user_id } });
    if (!user) {
      return responseData(res, "Không tìm thấy người dùng.", null, 404);
    }

    const rates = await model.rate_res.findAll({
      where: { user_id },
      include: ["user", "re"],
    });
    responseData(
      res,
      "Lấy danh sách đánh giá theo người dùng thành công.",
      rates,
      200
    );

    try {
    } catch (error) {
      responseData(
        res,
        "Đã có lỗi xảy ra - không thể lấy danh sách đánh giá theo người dùng.",
        null,
        400
      );
    }
  },
};

module.exports = rateControllers;
