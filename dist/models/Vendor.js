"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_config_1 = __importDefault(require("../config/db.config"));
class VendorInstance extends sequelize_1.Model {
}
exports.default = VendorInstance;
VendorInstance.init({
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: db_config_1.default,
    tableName: "vendor",
});
