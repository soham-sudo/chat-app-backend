import express from "express"

import cookieParser from "cookie-parser"

import cors from "cors"
import { createServer } from "http";
import { Server } from "socket.io";


const app = express()

const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  },
});

app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
))

app.use(express.json({limit:"16kb"}))

app.use(cookieParser())

import userRouter from "./routes/user.routes.js"

import chatRouter from "./routes/chat.routes.js";
import messageRouter from "./routes/message.routes.js";

app.use("/api/v1/users", userRouter)

app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);



io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

// http://localhost:8000/api/v1/users/signup

export default app

