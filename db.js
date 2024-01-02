require("dotenv").config();
const { Sequelize } = require("sequelize");

const db = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  ssl: {
    dialectOptions: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = db;