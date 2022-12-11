import C from "../constants";
import { Inject, Service } from "typedi";
import { UserService } from "./user.service";
import { IInitiateConnectionResponse } from "../interfaces";
import { ChatMessageService } from "./chat-message.service";
import { BadRequestError, UnprocessableError } from "../exceptions";
import { ChatType, InitiateSingleChatConnectionDto, SendChatMessageDto } from "../models";
import { IChatMessage } from "../database/types/chat-message.type";
import { ChatConnectionService } from "./chat-connection.service";
import { GroupChatService } from "./group-chat.service";

@Service()
export class ChatService {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly userService: UserService,
    @Inject() private readonly chatMessageService: ChatMessageService,
    @Inject() private readonly groupChatService: GroupChatService,
    @Inject() private readonly chatConnectionService: ChatConnectionService,
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

    await this.chatConnectionService.checkThatSingleConnectionDoesNotExist(userId, NEW_CONNECT_USER._id);
    await this.chatConnectionService.createChatConnection(userId, NEW_CONNECT_USER._id, ChatType.S);

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
   * @method sendChatMessage
   * @async
   * @param {string} userId
   * @param {SendChatMessageDto} data
   * @returns {Promise<IChatMessage>}
   */
  async sendChatMessage(userId: string, data: SendChatMessageDto): Promise<IChatMessage> {
    if (!(data.content = data.content.trim())) {
      throw new BadRequestError("Message must have valid content!");
    }

    data.recipientType = data.recipientType || ChatType.S;

    await this.chatConnectionService.checkThatChatConnectionExist(userId, data.recipientID);
    const CHAT_MESSAGE = await this.chatMessageService.saveChatMessage(
      userId,
      data.recipientID,
      data.recipientType,
      data.content,
    );

    await this.updateChatLastMessageAt(data.recipientID, data.recipientType, data.recipientType, CHAT_MESSAGE);

    return CHAT_MESSAGE;
  }

  private async updateChatLastMessageAt(recipient: string, recipientType: ChatType, from: string, chatMessage: IChatMessage): Promise<void> {
    if(recipientType === ChatType.S) {
      await this.chatConnectionService.updateSingleChatLastMessageAt(from, recipient, chatMessage.createdAt);
    } else {
      await this.groupChatService.updateChatLastMessageAt(recipient, chatMessage.createdAt);
    }
  }

}
