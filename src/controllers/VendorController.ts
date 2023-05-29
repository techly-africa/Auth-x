import { Vendor } from "../models/vendorModel";
import express from "express";
import bcrypt from "bcrypt";

export const Register = async (req: express.Request, res: express.Response) => {
  try {
    const userpassword = req.body.password;
    const hashed = await bcrypt.hash(userpassword, 10);
    const password = hashed;
    const data = await Vendor.create({ ...req.body, password });
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
