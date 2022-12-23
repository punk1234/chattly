/**
 * @interface IRTNewMessagePayload
 */
export interface IRTNewMessagePayload {
  chatId: string;
  message: string;
  messageAt: string;
  sender: string;
  // NOTE: SENDER IMAGE-URL TO BE IGNORED FOR NOW
  imageURL?: string;
}

/**
 * @interface IRTNewGroupChatPayload
 */
export interface IRTNewGroupChatPayload {
  chatId: string;
  name: string;
  imageURL: string;
  createdBy: string;
  message: string;
  messageAt: string;
}

/**
 * @interface IRealTimeEventHandlers
 */
export interface IRealTimeEventHandlers {
  onNewChatMessageHandler: (data: IRTNewMessagePayload) => void;
  onNewGroupChatHandler: (data: IRTNewGroupChatPayload) => void;
}
