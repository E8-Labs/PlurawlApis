import express from "express";
const userRouter = express.Router();
import {verifyJwtToken}  from "../middleware/jwtmiddleware.js";
import {RegisterUser, LoginUser, GetUserProfile, UpdateProfile, 
    GetUsers, UpdateGoals, CheckIn, UploadTracks, SocialLogin,
    SendPasswordResetEmail, ResetPassword, encrypt, AddCard, GetUserPaymentSources,
    subscribeUser, CancelSubscription, GetUserNotifications} from "../controllers/user.controller.js";



userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.post("/social_login", SocialLogin);
userRouter.post("/get_profile", verifyJwtToken, GetUserProfile);
userRouter.post("/update_profile", verifyJwtToken, UpdateProfile);
userRouter.post("/update_goals", verifyJwtToken, UpdateGoals);
userRouter.post("/checkin", verifyJwtToken, CheckIn);
userRouter.get("/users", verifyJwtToken, GetUsers);
userRouter.post("/upload_tracks", verifyJwtToken, UploadTracks);
userRouter.post("/add_card", verifyJwtToken, AddCard);
userRouter.get("/load_cards", verifyJwtToken, GetUserPaymentSources);
userRouter.post("/subscribe", verifyJwtToken, subscribeUser);
userRouter.post("/cancel_subscription", verifyJwtToken, CancelSubscription);
userRouter.get("/notifications", verifyJwtToken, GetUserNotifications);
userRouter.post("/send_reset_email", SendPasswordResetEmail);
userRouter.post("/update_password", ResetPassword);
userRouter.post("/encrypt", encrypt);


export default userRouter;