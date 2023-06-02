import express, { Router } from "express";
import { AllVendor, Login, Register } from "../controllers/VendorController";
import IsAuthenticated from "../middleware/authenticated";

const router: Router = express.Router();

router.post("/register", Register);
router.get("/vendors", IsAuthenticated, AllVendor);
router.get("/login", Login);

export default router;
