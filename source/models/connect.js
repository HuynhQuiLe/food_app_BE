//khai bao ket noi csdl
const { Sequelize } = require("sequelize");
const config = require("../config/config");

const sequelize = new Sequelize(config.database, config.user, config.pass, {
  host: config.host,
  port: config.port,
  dialect: config.dialect,
});

module.exports = sequelize;
