import { Document } from "mongoose";
import { ChatType } from "../../models";

/**
 * @interface IChatMessage
 */
export interface IChatMessage extends Document {
  _id: string;
  senderId: string;
  recipientId: string;
  recipientType: ChatType; // TODO: UPDATE API-SPEC to allow FULL-NAMES FOR CHAT KEYS like `SINGLE` instread of `S`
  content: string;
  createdAt: Date;
}
