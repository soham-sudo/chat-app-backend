import express from "express"
import { signup,login, logout,allUsers } from "../controller/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.post("/signup", signup)

router.post("/login", login)

//secure route

router.route("/").get(verifyJWT, allUsers);
router.route("/logout").get(verifyJWT,  logout)


export default router