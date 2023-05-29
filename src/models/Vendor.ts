import { Model, DataTypes } from "sequelize";
import db from "../config/db.config";

interface vendorAttributes {
  username: String;
  email: String;
  phone_number: Number;
  password: String;
}

export default class VendorInstance extends Model<vendorAttributes> {}

VendorInstance.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    tableName: "vendor",
  }
);
