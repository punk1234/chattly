import { ChatType } from "../models";

/**
 * @interface IChat
 */
export interface IChat {
  title: string;
  chatType: ChatType;
  lastMessageAt: Date;
}