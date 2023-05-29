import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
  username: String,
  full_name: String,
  email: String,
  phone_number: Number,
  password: String,
});
const Vendor = mongoose.model("Vendor", VendorSchema);

export { Vendor };
