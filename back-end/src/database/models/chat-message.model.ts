import crypto from "crypto";
import { ChatType } from "../../models";
import { model, Schema } from "mongoose";
import { IChatMessage } from "../types/chat-message.type";

const ChatMessageSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => crypto.randomUUID(),
      required: true,
    },
    senderId: {
      type: String,
      required: true
    },
    recipientId: {
      type: String,
      required: true
    },
    recipientType: { // NOTE: REMOVE IF NOT NEEDED AS CONNECTION ALREADY HAS THIS
      type: String,
      enum: Object.values(ChatType),
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
  },
  {
    toJSON: {
      versionKey: false,
      virtuals: true,

      transform: function (doc: any, ret: any) {
        delete ret._id;
        ret.id = doc._id;
      },
    },
  },
);

export default model<IChatMessage>("chat_messages", ChatMessageSchema);
