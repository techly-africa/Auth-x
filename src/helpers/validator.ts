import Joi from "joi";
import { IVendor } from "./interfaces";

const VendorRegisterSchema = Joi.object<IVendor>({
  username: Joi.string().required(),
  full_name: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  phone_number: Joi.string().min(10).max(12).required(),
  email: Joi.string().email().required().lowercase(),
});
export { VendorRegisterSchema };
