import { Router } from "express"
import { registerUser, login, logoutUser } from "../controllers/auth.controllers.js"
import { validate } from "../middleware/validator.middleware.js"
import { userRegistervalidator, userLoginValidator } from "../validators/index.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.route("/register").post(userRegistervalidator(), validate, registerUser)
router.route("/login").post(userLoginValidator(), validate, login);
router.route("/logout").post( verifyJWT, logoutUser );

export default router