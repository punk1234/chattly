import crypto from "crypto";
import { ChatType } from "../../models";
import { model, Schema } from "mongoose";
import { IChatConnection } from "../types/chat-connection.type";

const ChatConnectionSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => crypto.randomUUID(),
      required: true,
    },
    connectOne: {
      type: String,
      required: true,
    },
    connectTwo: {
      type: String,
      required: true,
    },
    connectTwoType: {
      type: String,
      enum: Object.values(ChatType),
      required: true,
    },
    initiatedAt: {
      type: Date,
      default: Date.now,
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

export default model<IChatConnection>("chat_connections", ChatConnectionSchema);
