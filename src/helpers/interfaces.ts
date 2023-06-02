import { Document } from "mongoose";

interface IVendor extends Document {
  username: string;
  full_name: string;
  email: string;
  phone_number: number;
  password: string;
}
interface LVendor extends Document {
  username: string;
  password: string;
}

export { IVendor, LVendor };
