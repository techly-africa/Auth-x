import { Vendor } from "../models/vendorModel";
import express from "express";
import bcrypt from "bcrypt";
import { VendorRegisterSchema } from "../helpers/validator";

export const Register = async (req: express.Request, res: express.Response) => {
  try {
    // const userpassword = req.body.password;
    const result = await VendorRegisterSchema.validateAsync(req.body);
    const hashed = await bcrypt.hash(result.password, 10);
    const password = hashed;

    const doesExist = await Vendor.findOne({ username: result.username });
    if (doesExist) console.log(`${result.username} already registered`);

    const data = await Vendor.create({ ...result, password });
    res.status(200).json({ msg: "created uccesscufly", data });
  } catch (error) {
    console.log("error tp register", error);
    res.send("error occured on saving a user ");
  }
};

export const AllVendor = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = await Vendor.find({});
    console.log("found vendor ");
    res.status(200).json(data);
  } catch (error) {
    console.log("can not fetch", error);
  }
};
