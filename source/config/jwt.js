const jwt = require("jsonwebtoken");
const responseData = require("./response");

const tokenMajors = {
  createToken: (data) => {
    let token = jwt.sign({ data }, process.env.TOKEN_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "30m",
    });
    return token;
  },
  createRefToken: (data) => {
    let token = jwt.sign({ data }, process.env.REFRESH_TOKEN_SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: "30d",
    });
    return token;
  },
  decodeToken: (token) => {
    return jwt.decode(token);
  },

  checkToken: (token) => {
    return jwt.verify(token, process.env.TOKEN_SECRET_KEY, (error, decode) => {
      return error;
    });
  },
  checkRefToken: (token) => {
    return jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      (error, decode) => {
        return error;
      }
    );
  },
  verifyToken: (req, res, next) => {
    const { token } = req.headers;
    const checkedToken = tokenMajors.checkToken(token);
    if (!checkedToken) {
      next();
    } else {
      responseData(res, "Not Authorized!", checkedToken.name, 400);
    }
  },
};

module.exports = tokenMajors;
