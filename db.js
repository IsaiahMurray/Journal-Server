require('dotenv').config();
const Sequelize = require("sequelize");

const db = new Sequelize('journal-walkthrough', 'postgres', 'weewoo123', {
    host: 'localhost',
    dialect: 'postgres'
});

module.exports = db;
