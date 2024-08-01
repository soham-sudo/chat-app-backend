import {Message} from '../models/message.model.js';
import {User} from '../models/user.model.js';
import {Chat} from '../models/chat.model.js';
import { apiResponse } from '../utils/apiResponse.js';

import { errorHandler } from '../utils/errorHandler.js';


//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = async (req, res,next) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "username profilePic email")
        .populate("chat");
      return res.json(apiResponse(200,messages,"all messages"));
    } catch (error) {
      return next(errorHandler(400,error.message));
    }
  };
  
  //@description     Create New Message
  //@route           POST /api/Message/
  //@access          Protected
  const sendMessage = async (req, res,next) => {
    const { content, chatId } = req.body;
  
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  
    let newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
  
    try {
      let message = await Message.create(newMessage);
  
      message = await message.populate("sender", "username profilePic").execPopulate();
      message = await message.populate("chat").execPopulate();
      message = await User.populate(message, {
        path: "chat.users",
        select: "username profilePic email",
      });
  
      await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
  
      return res.status(200).json(apiResponse(200,message,"Sent message"));
    } catch (error) {
        return next(errorHandler(400,error.message))
    }
  };
  
export { allMessages, sendMessage };
  