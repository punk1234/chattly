/**
 * @interface IChatMessage
 */
interface IChatMessage {
  from: string;
  content: string;
  createdAt: Date;
}

/**
 * @interface IChatMessages
 */
export interface IChatMessages {
  chatId: string;
  messages: Array<IChatMessage>;
}