import express from "express";
const adminRouter = express.Router();
import {verifyJwtToken}  from "../middleware/jwtmiddleware.js";
import { GetUsers, AdminDashboard, CreatePromoCode } from "../controllers/admin.controller.js";



adminRouter.get("/users", verifyJwtToken, GetUsers);
adminRouter.get("/dashboard", verifyJwtToken, AdminDashboard);
adminRouter.post("/create_promo", CreatePromoCode);

export default adminRouter;