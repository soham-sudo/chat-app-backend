import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";



import { errorHandler } from "../utils/errorHandler.js";
import { apiResponse } from "../utils/apiResponse.js";



//@description     Create or fetch One to One Chat
//@route           POST /api/chat/
//@access          Protected
const accessChat = async (req, res,next) => {
    const { receiverId } = req.body;

    // Check if it's a valid receiver
    const receiver = await User.findById(receiverId);

    if (!receiver) {
        return next(errorHandler(404, "Receiver does not exist")) ;
    }

    // check if receiver is not the user who is requesting a chat
    if (receiver._id.toString() === req.user._id.toString()) {
        return next(errorHandler(400, "You cannot chat with yourself")) ;
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { participants: { $elemMatch: { $eq: req.user._id } } },
            { participants: { $elemMatch: { $eq: receiverId } } },
        ],
    })
        .populate("participants", "-password")
        .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "username profilePic email",
    });

    if (isChat.length > 0) {
        return res
            .status(200)
            .json(apiResponse(200, isChat[0], "Chat retrieved successfully"));

    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            participants: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "participants",
                "-password"
            );

            return res.status(200).json(apiResponse(200,FullChat,"New chat created"));
        } catch (error) {
            return next(errorHandler(400,error.message))
        }
    }
};

//@description     Fetch all chats for a user
//@route           GET /api/chat/
//@access          Protected
const fetchChats = async (req, res,next) => {
    try {
        Chat.find({ participants: { $elemMatch: { $eq: req.user._id } } })
            .populate("participants", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email",
                });
                res.status(200).send(results);
            });
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

//@description     Create New Group Chat
//@route           POST /api/chat/group
//@access          Protected
const createGroupChat = async (req, res,next) => {
    if (!req.body.participants || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    let participants = JSON.parse(req.body.participants);

    if (participants.length < 2) {
        return res
            .status(400)
            .send("More than 2 participants are required to form a group chat");
    }

    participants.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            participants: participants,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("participants", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        return next(errorHandler(400,error.message))
    }
};

export {
    accessChat,
    fetchChats,
    createGroupChat,}