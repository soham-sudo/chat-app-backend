import express from "express"
import { accessChat,
    fetchChats,
    createGroupChat, } from "../controller/chat.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = express.Router()

router.route("/").post(verifyJWT, accessChat);
router.route("/").get(verifyJWT, fetchChats);
router.route("/group").post(verifyJWT, createGroupChat);

export default router