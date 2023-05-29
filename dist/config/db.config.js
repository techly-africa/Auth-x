"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db = new sequelize_1.Sequelize({
    database: "Mpa_cash",
    username: "postgres",
    password: "12345",
    host: "localhost",
    port: 5432,
    dialect: "postgres",
});
exports.default = db;
