import { Service } from "typedi";
import { IChatMessage } from "../database/types/chat-message.type";
import { ChatType } from "../models";
import ChatMessageModel from "../database/models/chat-message.model";
import config from "../config";
import { IChatMessages } from "../interfaces";

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

  /**
   * @method getTopChatsMessages
   * @async
   * @param {string} userId
   * @param {Array<string>} entityIds
   * @param {number} maxMessagePerChat
   * @returns {Promise<Array<IChatMessages>>}
   */
  async getTopChatsMessages(
    userId: string,
    entityIds: Array<string>,
    maxMessagePerChat: number = config.MAX_MESSAGES_PER_TOP_CHATS,
  ): Promise<Array<IChatMessages>> {
    return ChatMessageModel.aggregate([
      { $match: { recipientId: { $in: entityIds } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$recipientId",
          messages: {
            $push: {
              from: "$senderId",
              content: "$content",
              createdAt: "$createdAt",
            },

            // NOTE: FOR MONGODB ABOVE VERSION 5.2, `$topN` WORKS
            // "$topN": { n: maxMessagePerChat, sortBy: { createdAt: -1 }, output: {
            //   "from": "$senderId",
            //   "content": "$content",
            //   "createdAt": "$createdAt"
            // } }
          },
        },
      },
      // { $sort:  }
      {
        $project: {
          _id: 0,
          id: "$_id",
          messages: {
            $slice: ["$messages", maxMessagePerChat],
          },
        },
      },
    ]);
  }
}
