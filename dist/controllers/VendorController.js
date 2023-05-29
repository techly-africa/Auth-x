"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllVendor = exports.Register = void 0;
const vendorModel_1 = require("models/vendorModel");
const Register = async (req, res) => {
    try {
        const data = await vendorModel_1.Vendor.create(req.body);
        res.status(200).json({ msg: "created uccesscufly", data });
    }
    catch (error) {
        console.log("error tp register", error);
    }
};
exports.Register = Register;
const AllVendor = async (req, res) => {
    try {
        const data = await vendorModel_1.Vendor.find({});
        console.log("found vendor ");
        res.status(200).json(data);
    }
    catch (error) {
        console.log("can not fetch", error);
    }
};
exports.AllVendor = AllVendor;
