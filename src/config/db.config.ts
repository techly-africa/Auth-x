import { Sequelize } from "sequelize";

const db = new Sequelize({
  database: "Mpa_cash",
  username: "postgres",
  password: "12345",
  host: "localhost",
  port: 5432,
  dialect: "postgres",
});

export default db;
