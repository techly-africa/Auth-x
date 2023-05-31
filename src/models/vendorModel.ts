import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import express from "express";
import { IVendor } from "../helpers/interfaces";

const VendorSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  full_name: String,
  email: { type: String, unique: true },
  phone_number: String,
  password: String,
});
const Vendor = mongoose.model<IVendor>("Vendor", VendorSchema);

export { Vendor };
