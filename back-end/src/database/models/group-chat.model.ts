import crypto from "crypto";
import { model, Schema } from "mongoose";
import { IGroupChat } from "../types/group-chat.type";

const GroupChatSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => crypto.randomUUID(),
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    createdBy: {
      type: String,
      required: true,
    },
    lastChatMessageAt: {
      type: Date,
    }
  },
  {
    timestamps: true,
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

export default model<IGroupChat>("group_chats", GroupChatSchema);
