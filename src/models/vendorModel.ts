import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import express from "express";

interface IVendor extends Document {
  username: string;
  full_name: string;
  email: string;
  phone_number: number;
  password: string;
}
const VendorSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  full_name: String,
  email: { type: String, unique: true },
  phone_number: Number,
  password: String,
});
const Vendor = mongoose.model<IVendor>("Vendor", VendorSchema);

export { Vendor };
