"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
const vendorRoute_1 = __importDefault(require("../routes/vendorRoute"));
const port = 3000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.use("api/vendor", vendorRoute_1.default);
app.post("/vendor/create", (req, res) => {
    res.send("sure");
    console.log(req.body);
});
app.listen(port, () => {
    console.log("app running on port 3000");
});
