import crypto from "crypto";
import { Role } from "../../models";
import { model, Schema } from "mongoose";
import { IUser } from "../types/user.type";

const UserSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => crypto.randomUUID(),
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    chatDisplayName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    imageUrl: {
      type: String,
    },
    bio: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
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

export default model<IUser>("users", UserSchema);
