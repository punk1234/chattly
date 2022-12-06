import C from "../constants";
import { Inject, Service } from "typedi";
import { ChatType, CreateSingleChatConnectionDto } from "../models";
import { ConflictError, UnprocessableError } from "../exceptions";
import { UserService } from "./user.service";
import ChatConnectionModel from "../database/models/chat-connection.model";
import { IChatConnection } from "../database/types/chat-connection.type";
import { IChatMessage } from "../database/types/chat-message.type";
import ChatMessageModel from "../database/models/chat-message.model";
import { IInitiateConnectionResponse } from "../interfaces";

@Service()
export class ChatService {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private readonly userService: UserService) {}

  /**
   * @method initiateSingleChatConnection
   * @async
   * @param {string} userId
   * @param {CreateSingleChatConnectionDto} data
   * @returns {Promise<IInitiateConnectionResponse>}
   */
  async initiateSingleChatConnection(
    userId: string,
    data: CreateSingleChatConnectionDto,
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
    const CHAT_MESSAGE = await this.saveChatMessage(
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

  private async saveChatMessage(
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
}
