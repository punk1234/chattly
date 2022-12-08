import C from "../constants";
import { Inject, Service } from "typedi";
import { UserService } from "./user.service";
import { IInitiateConnectionResponse } from "../interfaces";
import { ChatMessageService } from "./chat-message.service";
import { ConflictError, UnprocessableError } from "../exceptions";
import { ChatType, InitiateSingleChatConnectionDto } from "../models";
import { IChatConnection } from "../database/types/chat-connection.type";
import ChatConnectionModel from "../database/models/chat-connection.model";

@Service()
export class ChatService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly chatMessageService: ChatMessageService,
  ) {}

  /**
   * @method initiateSingleChatConnection
   * @async
   * @param {string} userId
   * @param {InitiateSingleChatConnectionDto} data
   * @returns {Promise<IInitiateConnectionResponse>}
   */
  async initiateSingleChatConnection(
    userId: string,
    data: InitiateSingleChatConnectionDto,
  ): Promise<IInitiateConnectionResponse> {
    const NEW_CONNECT_USER = await this.userService.checkThatUserExistByIdentifier(
      C.UserIdentifier.USERNAME,
      data.newConnectUsername,
    );

    if (userId === NEW_CONNECT_USER?._id) {
      throw new UnprocessableError("User cannot connect with oneself!");
    }

    await this.checkThatSingleConnectionDoesNotExist(userId, NEW_CONNECT_USER._id);
    await this.createChatConnection(userId, NEW_CONNECT_USER._id, ChatType.S);

    // NOTE: MIGHT NOT BE THE BEST IF `username` CHANGES IN FUTURE, BUT NOT CHANGING FOR NOW
    const CHAT_MESSAGE = await this.chatMessageService.saveChatMessage(
      userId,
      NEW_CONNECT_USER._id,
      ChatType.S,
      data.initialChatMessage || `Hi @${NEW_CONNECT_USER.username}`,
    );

    return {
      connectUser: NEW_CONNECT_USER,
      initialChatMessage: CHAT_MESSAGE,
    };
  }

  /**
   * @method createChatConnection
   * @async
   * @param {string} initiatingUserId
   * @param {string} connectUserId
   * @param {string} chatType
   * @returns {Promise<IChatConnection>}
   */
  private async createChatConnection(
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
  private async checkThatSingleConnectionDoesNotExist(
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

  async bulkAddGroupChatMembers(
    groupChatId: string,
    membersUsernames: Array<string>,
  ): Promise<void> {
    const CONNECTIONS_DATA = membersUsernames.map(
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
