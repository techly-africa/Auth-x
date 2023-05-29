import express from "express";
import { AllVendor, Register } from "../controllers/VendorController";

const router = express.Router();

router.post("/register", Register);
router.get("/vendors", AllVendor);

export default router;
