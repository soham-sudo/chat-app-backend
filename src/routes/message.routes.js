import express from "express"
import { allMessages, sendMessage } from "../controller/message.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.route("/:chatId").get(verifyJWT, allMessages)
router.route("/").post(verifyJWT, sendMessage)

export default router