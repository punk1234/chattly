import { IUser } from "../database/types/user.type";
import { IChatMessage } from "../database/types/chat-message.type";

/**
 * @interface IInitiateConnectionResponse
 */
export interface IInitiateConnectionResponse {
  connectUser: IUser;
  initialChatMessage: IChatMessage;
}