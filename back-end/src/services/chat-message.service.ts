import { Service } from "typedi";
import { IChatMessage } from "../database/types/chat-message.type";
import { ChatType } from "../models";
import ChatMessageModel from "../database/models/chat-message.model";

@Service()
export class ChatMessageService {
  /**
   * @method saveChatMessage
   * @async
   * @param {string} senderId
   * @param {string} recipientId
   * @param {ChatType} chatType
   * @param {string} content
   * @returns {Promise<IChatMessage>}
   */
  async saveChatMessage(
    senderId: string,
    recipientId: string,
    chatType: ChatType,
    content: string,
  ): Promise<IChatMessage> {
    return new ChatMessageModel({
      senderId,
      recipientId,
      recipientType: chatType,
      content,
    }).save();
  }
}
