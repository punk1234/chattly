import { Inject, Service } from "typedi";
import { Controller } from "../decorators";
import { Request, Response } from "express";
import { ResponseHandler } from "../helpers";
import { ChatService } from "../services/chat.service";
import {
  CreateGroupChatDto,
  UpdateGroupChatDto,
  InitiateSingleChatConnectionDto,
  InitiateSingleChatConnectionResponse,
  User,
} from "../models";
import { ChatGroupService } from "../services/group-chat.service";

@Service()
@Controller()
export class ChatController {
  // eslint-disable-next-line no-useless-constructor
  constructor(
    @Inject() private readonly chatService: ChatService,
    @Inject() private readonly chatGroupService: ChatGroupService,
  ) {}

  /**
   * @method initiateSingleChatConnection
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async initiateSingleChatConnection(req: Request, res: Response) {
    const INITIATED_CONNECTION_RESPONSE = await this.chatService.initiateSingleChatConnection(
      req.auth?.userId as string,
      req.body as InitiateSingleChatConnectionDto,
    );

    const RESPONSE: InitiateSingleChatConnectionResponse = {
      chatMessage: INITIATED_CONNECTION_RESPONSE.initialChatMessage.content,
      newConnectUser: INITIATED_CONNECTION_RESPONSE.connectUser as User,
    };

    // THINKING OF USING GENERICS HERE FOR CREATED SUCH THAT `CreateSingleChatConnectionResponse` IS USED
    ResponseHandler.ok(res, RESPONSE);
  }

  /**
   * @method createGroupChat
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async createGroupChat(req: Request, res: Response) {
    const GROUP_CHAT = await this.chatGroupService.create(
      req.auth?.userId as string,
      req.body as CreateGroupChatDto,
    );

    ResponseHandler.created(res, GROUP_CHAT);
  }

  /**
   * @method updateGroupChat
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async updateGroupChat(req: Request, res: Response) {
    const GROUP_CHAT = await this.chatGroupService.update(
      req.params.groupChatId,
      req.body as UpdateGroupChatDto,
      req.auth?.userId as string,
    );

    ResponseHandler.ok(res, GROUP_CHAT);
  }

  /**
   * @method sendChatMessage
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  async sendChatMessage(req: Request, res: Response) {
    await this.chatService.sendChatMessage(
      req.auth?.userId as string,
      req.body,
    );

    ResponseHandler.ok(res, { success: true });
  }
}
