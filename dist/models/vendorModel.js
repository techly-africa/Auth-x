"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const VendorSchema = new mongoose_1.default.Schema({
    username: String,
    full_name: String,
    email: String,
    phone_number: Number,
    password: String,
});
const Vendor = mongoose_1.default.model("Vendor", VendorSchema);
exports.Vendor = Vendor;
