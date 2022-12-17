import "./Chat.css";
import { ChatMessagesView, ChatsView, Header } from "../../components";
import { useState } from "react";

export function Chat() {
  const [chatsMessages, setChatsMessages] = useState(null);

  return (
    <div className="Chat">
      <Header />

      <div className="Chat__board">
        <ChatsView setChatsMessagesHandler={setChatsMessages} />
        <ChatMessagesView messages={chatsMessages} />
      </div>
    </div>
  )
};