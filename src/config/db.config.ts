import { Sequelize } from "sequelize";

require("dotenv").config();

const db = new Sequelize({
  database: process.env.DATABASE,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: 5432 || process.env.PORT,
  dialect: "postgres" || process.env.DIALECT,
});

export default db;
