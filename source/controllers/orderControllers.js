const tokenMajors = require("../config/jwt");
const responseData = require("../config/response");

const initModels = require("../models/init-models");
const sequelize = require("../models/connect");

const model = initModels(sequelize);

const orderControllers = {
  create: async (req, res) => {
    try {
      const { food_id } = req.params;
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;

      // check món ăn tồn tại hay không
      const food = await model.food.findOne({ where: { food_id } });
      if (!food) {
        return responseData(res, "Không tìm thấy món ăn.", null, 404);
      }

      const { amount, order_code, arr_sub_id } = req.body;

      const order = { user_id, food_id, amount, order_code, arr_sub_id };

      //   Thêm vào data base
      const data = await model.orders.create(order);

      //   Trả về kết quả
      const result = await model.orders.findOne({
        where: { order_id: data.order_id },
        include: ["food", "user"],
      });

      responseData(res, "Đặt món ăn thành công.", result, 201);
    } catch (error) {
      responseData(res, "Đã có lỗi xảy ra - không thể đặt món ăn.", null, 400);
    }
  },
};

module.exports = orderControllers;
