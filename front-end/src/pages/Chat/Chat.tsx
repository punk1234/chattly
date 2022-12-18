import "./Chat.css";
import { ChatMessagesView, ChatsView, Header } from "../../components";
import { useState } from "react";

export function Chat() {
  const [chatsMessages, setChatsMessages] = useState(null);
  const [activeChat, setActiveChat] = useState<any>(null);

  return (
    <div className="Chat">
      <Header />

      <div className="Chat__board">
        <ChatsView
          setChatsMessagesHandler={setChatsMessages}
          setActiveChatHandler={setActiveChat}
        />

        <ChatMessagesView
          messages={chatsMessages}
          recipientID={activeChat?.chatId}
          chatType={activeChat?.chatType}
        />
      </div>
    </div>
  )
};