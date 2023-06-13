import { log } from "console";
import express from "express";
import { IVendor } from "helpers/interfaces";
import Jwt from "jsonwebtoken";

const IsAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.header("token");
  if (!token) {
    return res.status(401).json({ msg: "No Token found" });
  }

  try {
    const vendor = await Jwt.verify(
      token,
      process.env.JWT_SECRET as Jwt.Secret
    );

    next();
  } catch (error) {
    return res.status(400).json({ msg: "Invalid Token" });
  }
};
export default IsAuthenticated;
