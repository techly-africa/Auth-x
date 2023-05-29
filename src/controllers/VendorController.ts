import { Vendor } from "../models/vendorModel";
import express from "express";

export const Register = async (req: express.Request, res: express.Response) => {
  try {
    const data = await Vendor.create(req.body);
    res.status(200).json({ msg: "created uccesscufly", data });
  } catch (error) {
    console.log("error tp register", error);
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
