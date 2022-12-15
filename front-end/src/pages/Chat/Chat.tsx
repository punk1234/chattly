import "./Chat.css";
import { ChatMessagesView, ChatsView, Header } from "../../components";

export function Chat() {
  return (
    <div className="Chat">
      <Header />

      <div className="Chat__board">
        <ChatsView />
        <ChatMessagesView />
      </div>
    </div>
  )
};