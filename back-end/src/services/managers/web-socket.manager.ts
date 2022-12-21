import { WebSocket } from "ws";
import { Service } from "typedi";

@Service()
class WebSocketManager {
  private readonly usersToConnectionMap: Record<string, WebSocket> = {};

  addConnection(userId: string, ws: WebSocket): void {
    this.usersToConnectionMap[userId] = ws;
  }

  getConnection(userId: string): WebSocket {
    return this.usersToConnectionMap[userId];
  }

  removeConnection(userId: string): void {
    delete this.usersToConnectionMap[userId];
  }

  sendGroupMessages(recipientIds: Array<string>, message: string): void {
    for (const recipient of recipientIds) {
      // ONLY BROADCAST WHEN USER WEB-SOCKET EXISTS!
      this.usersToConnectionMap[recipient].send(message);
    }
  }

  getConnectionsCount(): number {
    return Object.keys(this.usersToConnectionMap).length;
  }
}

export const webSocketManager = new WebSocketManager();
