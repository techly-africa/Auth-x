import { Vendor } from "../models/vendorModel";
import express from "express";
import bcrypt from "bcrypt";
import { VendorRegisterSchema, VendorLoginSchema } from "../helpers/validator";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import IsAuthenticated from "../middleware/authenticated";

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

export const Login = async (
  req: express.Request,
  res: express.Response
): Promise<any> => {
  try {
    console.log(req.body);

    const result = await VendorLoginSchema.validateAsync(req.body);

    const doesExist = await Vendor.findOne({ username: result.username });

    if (doesExist) {
      const passmatch = await bcrypt.compare(
        result.password,
        doesExist.password
      );
      if (passmatch) {
        const token = Jwt.sign(
          { doesExist },
          process.env.JWT_SECRET as Jwt.Secret,
          { expiresIn: "30m" }
        );
        return res.status(200).json({ token: token });
      }
      return res.status(401).json({ msge: "unable to log in" });
    } else {
      return console.log(`${result.username} doesn't exists `);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server Error" });
  }
};

export const AllVendor = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const data = await Vendor.find({});
    console.log("found vendor ");
    return res.status(200).json(data);
  } catch (error) {
    console.log("can not fetch", error);
  }
};
