import express from "express";
const adminRouter = express.Router();
import {verifyJwtToken, verifyJwtTokenOptional}  from "../middleware/jwtmiddleware.js";
import { GetUsers, AdminDashboard, CreatePromoCode, makeAllFree } from "../controllers/admin.controller.js";



adminRouter.get("/users", verifyJwtToken, GetUsers);
adminRouter.get("/dashboard", verifyJwtToken, AdminDashboard);
adminRouter.post("/create_promo", CreatePromoCode);
adminRouter.post("/make_free", makeAllFree);

export default adminRouter;