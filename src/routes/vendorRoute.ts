import express, { Router } from "express";
import {
  AllVendor,
  Login,
  Register,
  Profile,
  EditProfile,
} from "../controllers/VendorController";
import IsAuthenticated from "../middleware/authenticated";

const router: Router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Vendor
 *   description: API endpoints to manage Vendor
 */

/**
 * @swagger
 * /api/vendor/register:
 *   post:
 *     summary: Register your Vendor Account
 *     tags: [Vendor]
 *     responses:
 *       200:
 *         description: Registration Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vendor'
 *       400:
 *         $ref: '#/components/responses/400'
 *       401:
 *         $ref: '#/components/responses/401'
 */
router.post("/register", Register);
router.get("/vendors", IsAuthenticated, AllVendor);
router.post("/login", Login);
router.get("/profile", IsAuthenticated, Profile);
router.put("/updateProfile", IsAuthenticated, EditProfile);

export default router;
