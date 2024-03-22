import express from "express";
const userRouter = express.Router();
import {verifyJwtToken}  from "../middleware/jwtmiddleware.js";
import {RegisterUser, LoginUser, GetUserProfile, UpdateProfile, 
    GetUsers, UpdateGoals, CheckIn, UploadTracks, SocialLogin,
    SendPasswordResetEmail, ResetPassword} from "../controllers/user.controller.js";



userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.post("/social_login", SocialLogin);
userRouter.post("/get_profile", verifyJwtToken, GetUserProfile);
userRouter.post("/update_profile", verifyJwtToken, UpdateProfile);
userRouter.post("/update_goals", verifyJwtToken, UpdateGoals);
userRouter.post("/checkin", verifyJwtToken, CheckIn);
userRouter.get("/users", verifyJwtToken, GetUsers);
userRouter.post("/upload_tracks", verifyJwtToken, UploadTracks);
userRouter.post("/send_reset_email", SendPasswordResetEmail);
userRouter.post("/update_password", ResetPassword);


export default userRouter;