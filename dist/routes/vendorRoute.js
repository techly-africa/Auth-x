"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VendorController_1 = require("../controllers/VendorController");
const router = express_1.default.Router();
router.post("/register", VendorController_1.Register);
router.get("/vendors", VendorController_1.AllVendor);
exports.default = router;
