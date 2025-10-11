import { Router } from "express"
import { registerUser } from "../controllers/auth.controllers.js"
import { validate } from "../middleware/validator.middleware.js"
import { userRegistervalidator } from "../validators/index.js"

const router = Router()

router.route("/register").post(userRegistervalidator(), validate, registerUser)


export default router