const initModels = require("../models/init-models");
const sequelize = require("../models/connect");
const tokenMajors = require("../config/jwt");
const responseData = require("../config/response");

const model = initModels(sequelize);

const likeControllers = {
  like: async (req, res) => {
    try {
      const { token } = req.headers;
      const { user_id } = tokenMajors.decodeToken(token).data;

      const { res_id } = req.params;

      // check nhà hàng tồn tại hay không
      const restaurant = await model.restaurant.findOne({ where: { res_id } });
      if (!restaurant) {
        return responseData(res, "Không tìm thấy nhà hàng.", null, 404);
      }

      const liked = await model.like_res.findOne({
        where: { res_id, user_id },
      });
      // Check đã like hay chưa?
      if (liked) {
        // Nếu đã like => set unlike => remove khỏi database
        await model.like_res.destroy({ where: { res_id, user_id } });
        responseData(
          res,
          `Bạn đã UNLIKE nhà hàng ${restaurant.res_name}.`,
          null,
          200
        );
      } else {
        // Nếu chưa like => set like => add vào database
        const like = {
          res_id,
          user_id,
          date_like: new Date(),
        };
        await model.like_res.create(like);
        responseData(
          res,
          `Bạn đã LIKE nhà hàng ${restaurant.res_name}.`,
          null,
          201
        );
      }
    } catch (error) {
      responseData(
        res,
        `Đã có lỗi xảy ra - không thể set like/ unlike nhà hàng`,
        null,
        400
      );
    }
  },
  getLikesByRes: async (req, res) => {
    try {
      const { res_id } = req.params;

      // check nhà hàng tồn tại hay không
      const restaurant = await model.restaurant.findOne({ where: { res_id } });
      if (!restaurant) {
        return responseData(res, "Không tìm thấy nhà hàng.", null, 404);
      }

      const likes = await model.like_res.findAll({
        where: { res_id },
        include: ["user", "re"],
      });
      responseData(
        res,
        `Lấy danh sách like theo nhà hàng thành công.`,
        likes,
        200
      );
    } catch (error) {
      responseData(
        res,
        `Đã có lỗi xảy ra - không thể lấy danh sách like theo nhà hàng`,
        null,
        400
      );
    }
  },
  getLikesByUser: async (req, res) => {
    try {
      const { user_id } = req.params;
      // check người dùng tồn tại hay không
      const user = await model.users.findOne({ where: { user_id } });
      if (!user) {
        return responseData(res, "Không tìm thấy người dùng.", null, 404);
      }

      const users = await model.like_res.findAll({
        where: { user_id },
        include: ["user", "re"],
      });
      responseData(
        res,
        `Lấy danh sách like theo người dùng thành công.`,
        users,
        200
      );
    } catch (error) {
      responseData(
        res,
        `Đã có lỗi xảy ra - không thể lấy danh sách like theo người dùng`,
        null,
        400
      );
    }
  },
};

module.exports = likeControllers;
