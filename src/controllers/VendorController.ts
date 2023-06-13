import { Vendor } from "../models/vendorModel";
import express from "express";
import bcrypt from "bcrypt";
import { VendorRegisterSchema, VendorLoginSchema } from "../helpers/validator";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import IsAuthenticated from "../middleware/authenticated";
import { log } from "console";

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
    // console.log(req.body);

    const result = await VendorLoginSchema.validateAsync(req.body);

    const doesExists = await Vendor.findOne({ username: result.username });

    if (doesExists) {
      const passmatch = await bcrypt.compare(
        result.password,
        doesExists.password
      );
      if (passmatch) {
        const token = Jwt.sign(
          { doesExists },
          process.env.JWT_SECRET as Jwt.Secret,
          { expiresIn: "30m" }
        );
        return res.status(200).json({ token: token });
      }
      return res.status(401).json({ msge: "unable to log in" });
    } else {
      const doesExists = await Vendor.findOne({ email: result.username });
      if (doesExists) {
        const passmatch = await bcrypt.compare(
          result.password,
          doesExists.password
        );
        if (passmatch) {
          const token = Jwt.sign(
            { doesExists },
            process.env.JWT_SECRET as Jwt.Secret
          );
          return res.status(200).json({ token: token });
        } else {
          return res.status(402).json({ message: "invalid password" });
        }
      } else {
        return res.status(401).json({ message: "user not found" });
      }
      // return console.log(`${result.username} doesn't exists `);
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
export const Profile = async (req: express.Request, res: express.Response) => {
  const token = req.header("token");
  if (!token) return res.status(400).json({ message: "no token found" });
  try {
    const vendor: any = await Jwt.verify(
      token,
      process.env.JWT_SECRET as Jwt.Secret
    );
    console.log(vendor.doesExists._id);

    return res.status(200).json({ vendor });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
export const EditProfile = async (
  req: express.Request,
  res: express.Response
) => {
  const token = req.header("token");
  if (!token) return res.status(400).json({ message: "no token found" });
  try {
    const vendor: any = await Jwt.verify(
      token,
      process.env.JWT_SECRET as Jwt.Secret
    );
    // console.log(vendor);

    const id = vendor.doesExists._id;
    const validated = VendorRegisterSchema.validateAsync(req.body);

    console.log(await Vendor.findById(id));
    const profile = await Vendor.findByIdAndUpdate(id, {
      $set: {
        username: (await validated).username,
        full_name: (await validated).full_name,
        email: (await validated).email,
        phone_number: (await validated).phone_number,
      },
    });
    if (profile)
      return res.status(201).json({ message: "updated successfully", profile });

    return res.status(400).json({ message: "not update" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: "error" });
  }
};
