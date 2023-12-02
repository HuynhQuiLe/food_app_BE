const initModels = require("../models/init-models");
const sequelize = require("../models/connect");
const responseData = require("../config/response");
const tokenMajors = require("../config/jwt");
const bcrypt = require("bcrypt");
const model = initModels(sequelize);

const authControllers = {
  login: async (req, res) => {
    try {
      const { email, user_password } = req.body;
      const user = await model.users.findOne({ where: { email } });
      if (!user) {
        return responseData(res, "Không tìm thấy email người dùng.", null, 404);
      }
      if (!bcrypt.compareSync(user_password, user.user_password)) {
        return responseData(res, "Mật khẩu không đúng.", null, 400);
      }

      const key = new Date().getTime();
      const token = tokenMajors.createToken({ user_id: user.user_id, key });
      const refToken = tokenMajors.createRefToken({
        user_id: user.user_id,
        key,
      });

      await model.users.update(
        { ...user.dataValues, refresh_token: refToken },
        { where: { email } }
      );

      responseData(res, "Đăng nhập thành công.", token, 200);
    } catch (error) {
      responseData(res, "Đã có lỗi xảy ra - không thể đăng nhập.", null, 400);
    }
  },

  register: async (req, res) => {
    try {
      const { full_name, email, user_password } = req.body;

      const duplicate = await model.users.findOne({ where: { email } });

      if (duplicate) {
        return responseData(res, "Email đã tồn tại.", null, 409);
      }

      const user = {
        full_name,
        email,
        user_password: bcrypt.hashSync(user_password, 10),
      };
      await model.users.create(user);
      responseData(res, "Đăng ký người dùng thành công.", null, 201);
    } catch (error) {
      responseData(res, "Đã có lỗi xảy ra - không thể đăng ký.", null, 400);
    }
  },
};

module.exports = authControllers;
