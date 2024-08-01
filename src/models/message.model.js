import mongoose, { Schema } from "mongoose";


const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", MessageSchema);
