import { useEffect, useState } from "react";
import { apiHandler } from "../../helpers";
import { IChatSummary } from "../../interfaces";
import ChatSummaryCard from "../ChatSummaryCard/ChatSummaryCard";
import "./ChatsView.css";

export function ChatsView() {
  const [chats, setChats] = useState<Array<IChatSummary> | null>(null);
  const [infoMsg, setInfoMsg] = useState("");

  const fetchChatsFromApi = async () => {
    const [success, data] = await apiHandler.sendWithAuthToken(
      "GET", 
      "/me/chats"
    );

    console.log(data);

    success ?
      setChats(data.records) :
      setInfoMsg((data as any)?.message);
  }

  useEffect(() => {
    fetchChatsFromApi();
  }, []);
  
  return (
    <div className="ChatsView">
      <div>ChatsView</div>
      { infoMsg && <div>{ infoMsg }</div> }

      { chats?.length && chats.map((chat, idx) => (
        //   <div>
        //     { chat.title }
        //   </div>

        <ChatSummaryCard
          key={idx}
          title={chat.title}
          lastMessageAt={chat.lastMessageAt}
          chatType={chat.chatType}
          chatId={chat.chatId}
        />
      ))}
    </div>
  )
}