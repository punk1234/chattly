import { Service } from "typedi";
import { ChatType } from "../models";
import { ConflictError, UnprocessableError } from "../exceptions";
import { IChatConnection } from "../database/types/chat-connection.type";
import ChatConnectionModel from "../database/models/chat-connection.model";
import { IChat } from "../interfaces";

@Service()
export class ChatConnectionService {
  /**
   * @method createChatConnection
   * @async
   * @param {string} initiatingUserId
   * @param {string} connectUserId
   * @param {string} chatType
   * @returns {Promise<IChatConnection>}
   */
  async createChatConnection(
    initiatingUserId: string,
    connectUserId: string,
    chatType: ChatType,
  ): Promise<IChatConnection> {
    return new ChatConnectionModel({
      connectOne: initiatingUserId,
      connectTwo: connectUserId,
      connectTwoType: chatType,
    }).save();
  }

  /**
   * @method checkThatSingleConnectionDoesNotExist
   * @async
   * @param {string} connectOneId
   * @param {string} connectTwoId
   */
  async checkThatSingleConnectionDoesNotExist(
    connectOneId: string,
    connectTwoId: string,
  ): Promise<void> {
    const CONNECT_IDS: Array<string> = [connectOneId, connectTwoId];

    // TODO: CHECKOUT HOW THIS AFFECTS INDEXING or IS IT BETTER TO USE `A & B OR B & A`
    // DOES `$in` USE INDEX
    const FOUND_CONNECTION = await ChatConnectionModel.findOne({
      connectOne: { $in: CONNECT_IDS },
      connectTwo: { $in: CONNECT_IDS },
      connectTwoType: ChatType.S,
    });

    if (FOUND_CONNECTION) {
      throw new ConflictError("Single chat connection already exist!");
    }
  }

  /**
   * @method checkThatChatConnectionExist
   * @async
   * @param {string} connectOneId
   * @param {string} connectTwoId
   * @param {ChatType} connectTwoType
   */
  async checkThatChatConnectionExist(
    connectOneId: string,
    connectTwoId: string,
    connectTwoType: ChatType = ChatType.S,
  ): Promise<IChatConnection> {
    const CONNECT_IDS: Array<string> = [connectOneId, connectTwoId];
    console.log(CONNECT_IDS, connectTwoType);

    // TODO: CHECKOUT HOW THIS AFFECTS INDEXING or IS IT BETTER TO USE `A & B OR B & A`
    // DOES `$in` USE INDEX
    const FOUND_CONNECTION = await ChatConnectionModel.findOne({
      connectOne: { $in: CONNECT_IDS },
      connectTwo: { $in: CONNECT_IDS },
      connectTwoType,
    });

    if (FOUND_CONNECTION) {
      return FOUND_CONNECTION;
    }

    throw new UnprocessableError("No Chat connection!");
  }

  /**
   * @method updateSingleChatLastMessageAt
   * @async
   * @param {string} connectOne
   * @param {string} connectTwo
   * @param {Date} lastChatMessageAt
   */
  async updateSingleChatLastMessageAt(
    connectOne: string,
    connectTwo: string,
    lastChatMessageAt: Date,
  ): Promise<void> {
    const CONNECT_IDS: Array<string> = [connectOne, connectTwo];

    await ChatConnectionModel.updateOne(
      {
        connectOne: { $in: CONNECT_IDS },
        connectTwo: { $in: CONNECT_IDS },
      },
      { lastChatMessageAt },
    );
  }

  /**
   * @method updateSingleChatLastMessageAtById
   * @async
   * @param {string} connectionId
   * @param {Date} lastChatMessageAt
   */
  async updateSingleChatLastMessageAtById(
    connectionId: string,
    lastChatMessageAt: Date,
  ): Promise<void> {
    await ChatConnectionModel.updateOne({ _id: connectionId }, { lastChatMessageAt });
  }

  /**
   * @method getGroupChatConnections
   * @async
   * @param {string} chatGroupId
   * @param {Array<string>} usernames
   * @returns {Promise<Array<IChatConnection>>}
   */
  async getGroupChatConnections(
    chatGroupId: string,
    usernames: Array<string>,
  ): Promise<Array<IChatConnection>> {
    const FOUND_CONNECTIONS = await ChatConnectionModel.find({
      connectOne: { $in: usernames },
      connectTwo: chatGroupId,
      connectTwoType: ChatType.G,
    }).select("connectOne -_id");

    return FOUND_CONNECTIONS;
  }

  /**
   * @method bulkAddChatConnections
   * @async
   * @param {string} groupChatId
   * @param {Array<string>} connnectionsUsernames
   */
  async bulkAddChatConnections(
    groupChatId: string,
    connnectionsUsernames: Array<string>,
  ): Promise<void> {
    const CONNECTIONS_DATA = connnectionsUsernames.map(
      (username: string) =>
        new ChatConnectionModel({
          connectOne: username,
          connectTwo: groupChatId,
          connectTwoType: ChatType.G,
        }),
    );

    await ChatConnectionModel.bulkSave(CONNECTIONS_DATA);
  }

  /**
   * @method getChats
   * @async
   * @param {string} username
   * @returns {Promise<IChat[]>}
   */
  async getChats(username: string): Promise<IChat[]> {
    return ChatConnectionModel.aggregate([
      { $match: { $or: [{ connectOne: username }, { connectTwo: username }] } },
      {
        $lookup: {
          from: "group_chats",
          localField: "connectTwo",
          foreignField: "_id",
          as: "group_chat",
        },
      },
      {
        $project: {
          _id: 0,
          chatType: "$connectTwoType",
          title: {
            $cond: {
              if: { $eq: ["$connectTwoType", ChatType.S] },
              then: {
                $cond: {
                  if: { $eq: ["$connectOne", username] },
                  then: "$connectTwo",
                  else: "$connectOne",
                },
              },
              else: { $arrayElemAt: ["$group_chat.name", 0] },
            },
          },
          lastMessageAt: {
            $cond: {
              if: { $eq: ["$connectTwoType", ChatType.S] },
              then: "$lastChatMessageAt",
              else: { $arrayElemAt: ["$group_chat.lastChatMessageAt", 0] },
            },
          },
        },
      },
      { $sort: { lastMessageAt: -1 } },
    ]);
  }
}
