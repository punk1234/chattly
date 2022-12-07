import { Document } from "mongoose";

/**
 * @interface IGroupChat
 */
export interface IGroupChat extends Document {
  _id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
