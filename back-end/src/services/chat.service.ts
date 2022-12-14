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
import { webSocketManager } from "./managers/web-socket.manager";

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
   * @param {string} username
   * @param {InitiateSingleChatConnectionDto} data
   * @returns {Promise<IInitiateConnectionResponse>}
   */
  async initiateSingleChatConnection(
    username: string,
    data: InitiateSingleChatConnectionDto,
  ): Promise<IInitiateConnectionResponse> {
    const NEW_CONNECT_USER = await this.userService.checkThatUserExistByIdentifier(
      C.UserIdentifier.USERNAME,
      data.newConnectUsername,
    );

    if (username === NEW_CONNECT_USER.username) {
      throw new UnprocessableError("User cannot connect with oneself!");
    }

    await this.chatConnectionService.checkThatSingleConnectionDoesNotExist(
      username,
      NEW_CONNECT_USER.username,
    );

    const CHAT_CONNECTION = await this.chatConnectionService.createChatConnection(
      username,
      NEW_CONNECT_USER.username,
      ChatType.S,
    );

    // NOTE: MIGHT NOT BE THE BEST IF `username` CHANGES IN FUTURE, BUT NOT CHANGING FOR NOW
    const CHAT_MESSAGE = await this.chatMessageService.saveChatMessage(
      username,
      // NEW_CONNECT_USER.username,
      CHAT_CONNECTION._id,
      ChatType.S,
      data.initialChatMessage || `Hi @${NEW_CONNECT_USER.username}`,
    );

    await this.chatConnectionService.updateSingleChatLastMessageAtById(
      CHAT_CONNECTION._id,
      CHAT_MESSAGE.createdAt,
    );

    return {
      connectUser: NEW_CONNECT_USER,
      initialChatMessage: CHAT_MESSAGE,
    };
  }

  /**
   * @method sendChatMessage
   * @async
   * @param {string} username
   * @param {SendChatMessageDto} data
   * @returns {Promise<IChatMessage>}
   */
  async sendChatMessage(username: string, data: SendChatMessageDto): Promise<IChatMessage> {
    if (!(data.content = data.content.trim())) {
      throw new BadRequestError("Message must have valid content!");
    }

    data.recipientType = data.recipientType || ChatType.S;
    console.log(username);

    const CONNECTION = await this.chatConnectionService.checkThatChatConnectionExist(
      username,
      data.recipientID,
      data.recipientType,
    );

    const CHAT_MESSAGE = await this.chatMessageService.saveChatMessage(
      username,
      data.recipientType === ChatType.S ? CONNECTION._id : data.recipientID,
      data.recipientType,
      data.content,
    );

    await this.updateChatLastMessageAt(
      data.recipientID,
      data.recipientType,
      username,
      CHAT_MESSAGE,
    );

    await this.broadcastNewMessage(username, data);

    return CHAT_MESSAGE;
  }

  /**
   * @method broadcastNewMessage
   * @async
   * @param {string} senderUsername
   * @param {SendChatMessageDto} data
   * @returns {Promise<void>}
   */
  private async broadcastNewMessage(
    senderUsername: string,
    data: SendChatMessageDto,
  ): Promise<void> {
    const OTHER_GROUP_MEMBERS_USERNAMES =
      data.recipientType === ChatType.S
        ? [data.recipientID]
        : await this.chatConnectionService.getGroupChatMembers(data.recipientID, senderUsername);

    webSocketManager.sendGroupMessages(OTHER_GROUP_MEMBERS_USERNAMES, data.content);
  }

  /**
   * @method updateChatLastMessageAt
   * @async
   * @param {string} recipient
   * @param {ChatType} recipientType
   * @param {string} from
   * @param {IChatMessage} chatMessage
   */
  private async updateChatLastMessageAt(
    recipient: string,
    recipientType: ChatType,
    from: string,
    chatMessage: IChatMessage,
  ): Promise<void> {
    if (recipientType === ChatType.S) {
      await this.chatConnectionService.updateSingleChatLastMessageAt(
        from,
        recipient,
        chatMessage.createdAt,
      );
    } else {
      await this.groupChatService.updateChatLastMessageAt(recipient, chatMessage.createdAt);
    }
  }
}
