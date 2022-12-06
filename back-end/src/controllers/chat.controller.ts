import { Inject, Service } from "typedi";
import { Controller } from "../decorators";
import { Request, Response } from "express";
import { ResponseHandler } from "../helpers";
import { ChatService } from "../services/chat.service";
import { CreateSingleChatConnectionDto, CreateSingleChatConnectionResponse, User } from "../models";

@Service()
@Controller()
export class ChatController {
  // eslint-disable-next-line no-useless-constructor
  constructor(@Inject() private readonly chatService: ChatService) {}

  /**
   * @method createSingleChatConnection
   * @async
   * @param {Request} req
   * @param {Response} res
   */
  // CHANGE NAME TO initiateSingleChatConnection & probably response should be `200`
  async createSingleChatConnection(req: Request, res: Response) {
    const INITIATED_CONNECTION_RESPONSE = await this.chatService.createSingleChatConnection(
      req.auth?.userId as string,
      req.body as CreateSingleChatConnectionDto,
    );

    const RESPONSE: CreateSingleChatConnectionResponse = {
      chatMessage: INITIATED_CONNECTION_RESPONSE.initialChatMessage.content,
      newConnectUser: INITIATED_CONNECTION_RESPONSE.connectUser as User,
    };

    // THINKING OF USING GENERICS HERE FOR CREATED SUCH THAT `CreateSingleChatConnectionResponse` IS USED
    ResponseHandler.created(res, RESPONSE);
  }
}
