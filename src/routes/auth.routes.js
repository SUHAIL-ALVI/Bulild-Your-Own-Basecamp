import { Router } from "express"
import { registerUser, login } from "../controllers/auth.controllers.js"
import { validate } from "../middleware/validator.middleware.js"
import { userRegistervalidator, userLoginValidator } from "../validators/index.js"

const router = Router()

router.route("/register").post(userRegistervalidator(), validate, registerUser)
router.route("/login").post(userLoginValidator(), validate, login);

export default router