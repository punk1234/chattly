import "./Chat.css";
import { ChatMessagesView, ChatsView, Header } from "../../components";
import { useEffect, useState } from "react";

// NOTE: MOVING THIS OUT OF THE COMPONENT MADE IT WORK
const CHATS_MAP: Record<string, Array<any>> = {};

export function Chat() {
  // THINKING: SHOULD GET CHATS-MESSAGES BE DONE HERE ? SINCE THIS HAPPENS ONCE
  const [chatsMessages, setChatsMessages] = useState<Array<any>>();

  const [activeChat, setActiveChat] = useState<any>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<Array<any>>();

  // const CHATS_MAP: Record<string, Array<any>> = {};
  // console.log("---", CHATS_MAP)

  useEffect(() => {
    chatsMessages?.forEach(chatWithMessages => {
      CHATS_MAP[chatWithMessages["id"]] = chatWithMessages["messages"].reverse();
    });
    
    console.log("CHATS_MAP", CHATS_MAP);
  }, [chatsMessages]);

  useEffect(() => {
    console.log("CHATS_MAP", activeChat?.chatId);
    setActiveChatMessages(CHATS_MAP[activeChat?.chatId]);
    console.log("@@@CRAZY!!!", CHATS_MAP[activeChat?.chatId]);
  }, [activeChat]);

  return (
    <div className="Chat">
      <Header />

      <div className="Chat__board">
        <ChatsView
          setChatsMessagesHandler={setChatsMessages}
          setActiveChatHandler={setActiveChat}
        />

        <ChatMessagesView
          messages={activeChatMessages}
          recipientID={activeChat?.singleChatUsername || activeChat?.chatId}
          chatType={activeChat?.chatType}
        />
      </div>
    </div>
  )
};