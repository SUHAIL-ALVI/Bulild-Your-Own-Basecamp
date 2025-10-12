import { Router } from "express"
import { registerUser, login, logoutUser, verifyEmail, refreshAccesToken, forgotPasswordRequest, resetForgotPassword, getCurrentUser, changeCurrentPassword, resendEmailVerification } from "../controllers/auth.controllers.js"
import { validate } from "../middleware/validator.middleware.js"
import { userRegistervalidator, userLoginValidator, userForgotPasswordValidator, userResetForgotPassword, userChangeCurrentPasswordValidator } from "../validators/index.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

//unsecure routes
router.route("/register").post(userRegistervalidator(), validate, registerUser)
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/verify-email/:verificationToken").get( verifyEmail );
router.route("/refresh-token").post( refreshAccesToken );
router.route("/forgot-password").post(userForgotPasswordValidator(), validate, forgotPasswordRequest )
router.route("/reset-password:resetToken").post(userResetForgotPassword(), validate, resetForgotPassword)



//secure routes
router.route("/logout").post( verifyJWT, logoutUser );
router.route("/current-user").post( verifyJWT, getCurrentUser );
router.route("/change-password").post( verifyJWT, userChangeCurrentPasswordValidator(), validate, changeCurrentPassword );
router.route("/resend-email-verification").post( verifyJWT, resendEmailVerification );

export default router