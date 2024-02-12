import express from "express";
const userRouter = express.Router();
import {verifyJwtToken}  from "../middleware/jwtmiddleware.js";
import {RegisterUser, LoginUser, GetUserProfile, UpdateProfile, 
    GetUsers, UpdateGoals, CheckIn} from "../controllers/user.controller.js";



userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.post("/get_profile", verifyJwtToken, GetUserProfile);
userRouter.post("/update_profile", verifyJwtToken, UpdateProfile);
userRouter.post("/update_goals", verifyJwtToken, UpdateGoals);
userRouter.post("/checkin", verifyJwtToken, CheckIn);
userRouter.get("/users", verifyJwtToken, GetUsers);

export default userRouter;