import C from "../constants";
import { Inject, Service } from "typedi";
import { UserService } from "./user.service";
import { IInitiateConnectionResponse } from "../interfaces";
import { ChatMessageService } from "./chat-message.service";
import { BadRequestError, ConflictError, UnprocessableError } from "../exceptions";
import { ChatType, InitiateSingleChatConnectionDto, SendChatMessageDto } from "../models";
import { IChatConnection } from "../database/types/chat-connection.type";
import ChatConnectionModel from "../database/models/chat-connection.model";
import { IChatMessage } from "../database/types/chat-message.type";

@Service()
export class ChatConnectionService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly chatMessageService: ChatMessageService,
  ) {}

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

  async updateSingleChatLastMessageAt(connectOne: string, connectTwo: string, lastChatMessageAt: Date): Promise<void> {
    const CONNECT_IDS: Array<string> = [connectOne, connectTwo];

    await ChatConnectionModel.updateOne(
      {
        connectOne: { $in: CONNECT_IDS },
        connectTwo: { $in: CONNECT_IDS }
      },
      { lastChatMessageAt }
    );
  }

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

}
