import express from "express";
const userRouter = express.Router();
import {verifyJwtToken}  from "../middleware/jwtmiddleware.js";
import {RegisterUser, LoginUser, GetUserProfile, UpdateProfile, 
    GetUsers, UpdateGoals, CheckIn, UploadTracks, SocialLogin,
    SendPasswordResetEmail, ResetPassword, encrypt, AddCard, GetUserPaymentSources,
    subscribeUser, CancelSubscription, GetUserNotifications, DeleteAllSubscriptions, DeleteUser,
generateWebAccessCode, verifyWebAccessCode, contactUsEmail, IsCouponValid, SendEmailVerificationCode, VerifyEmailCode, CheckEmailExists} from "../controllers/user.controller.js";


    import { CreateWebHook, SubscriptionUpdated } from "../controllers/stripe.js";



userRouter.post("/checkEmailExists", CheckEmailExists);
userRouter.post("/sendVerificationEmail", SendEmailVerificationCode);
userRouter.post("/verifyEmail", VerifyEmailCode);


userRouter.post("/register", RegisterUser);
userRouter.post("/login", LoginUser);
userRouter.post("/is_coupon_valid", IsCouponValid);
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
userRouter.post("/delete_account", verifyJwtToken, DeleteUser);
userRouter.post("/send_reset_email", SendPasswordResetEmail);
userRouter.post("/update_password", ResetPassword);
userRouter.post("/encrypt", encrypt);
userRouter.post("/delete_test_subs", DeleteAllSubscriptions);

userRouter.post("/create_webhook", CreateWebHook);
userRouter.post("/subscription_updated", SubscriptionUpdated);

userRouter.post("/create_web_token", verifyJwtToken, generateWebAccessCode);
userRouter.post("/verify_web_token", verifyWebAccessCode);
userRouter.post("/contact_us", contactUsEmail);


export default userRouter;