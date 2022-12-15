import { ChatType } from "./requests-responses/chat-type";

/**
 * @interface IChatSummary
 */
export interface IChatSummary {
  title: string;
  lastMessageAt: string;
  chatType: ChatType;
  chatId: string; // `ID` OF CHAT-CONNECTION OR GROUP-CHAT
}