import { IRealTimeEventHandlers, IRTNewMessagePayload } from "../interfaces";

/**
 * @class RealTimeEventRegistrar
 */
export class RealTimeEventRegistrar {

  static sync(webSocketHost: string, username: string, eventHandlers: IRealTimeEventHandlers): void {
    const webSocket = new WebSocket(`${webSocketHost}/${username}`);

    webSocket.onmessage = (evt: MessageEvent<IRTNewMessagePayload>): void => {
      // TODO: HANDLE ON-MESSAGE EVENT
      // IF `evt.data.type === "MSG"` ELSE IF ``evt.data.type === "NGC"` ELSE `IGNORE`
      eventHandlers.onNewChatMessageHandler(evt.data);
    }

    webSocket.onerror = (evt: Event): void => {
      // TODO: HANDLE ON-ERROR EVENT
    }

    webSocket.onopen = (evt: Event): void => {
      // TODO: HANDLE ON-OPEN EVENT
    }

    webSocket.onclose = (evt: CloseEvent): void => {
      // TODO: HANDLE ON-CLOSE EVENT
    }

    console.log("+++++")

    // NOTE: TESTING ON-MESSAGE EVENT
    setInterval(() => {
      console.log("---> GOT HERE 5SEC(S)!!!");
      console.log(eventHandlers.onNewChatMessageHandler)

      eventHandlers.onNewChatMessageHandler({
        chatId: "9de37e78-24a8-4910-a0b8-256a4d0a00dc",
        message: "Hmmm, testing websocket from front-end...!",
        messageAt: new Date().toISOString(),
        sender: "abcd"
      });
    }, 5000);
  }

}