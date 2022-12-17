import { useEffect, useState } from "react";
import { apiHandler } from "../../helpers";
import { IChatSummary } from "../../interfaces";
import ChatSummaryCard from "../ChatSummaryCard/ChatSummaryCard";
import "./ChatsView.css";

interface IProps {
  setChatsMessagesHandler: Function;
}

export function ChatsView(props: IProps) {
  const [chats, setChats] = useState<Array<IChatSummary> | null>(null);
  const [infoMsg, setInfoMsg] = useState("");

  const fetchChatsFromApi = async () => {
    const [success, data] = await apiHandler.sendWithAuthToken(
      "GET",
      "/me/chats"
    );

    success ?
      setChats(data.records) :
      setInfoMsg((data as any)?.message);console.log("CHATS", chats)

    const entityIds = chats?.map(item => item.chatId);console.log(entityIds)
    const [msgSuccess, msgData] = await apiHandler.sendWithAuthToken(
      "POST",
      "/me/top-chats/messages",
      { entityIds }
    );

    console.log(msgData);

    msgSuccess ?
      props.setChatsMessagesHandler(msgData.records) :
      setInfoMsg((msgData as any)?.message);
  }

  useEffect(() => {
    fetchChatsFromApi();
  }, []);
  
  return (
    <div className="ChatsView">
      <div>ChatsView</div>

      { infoMsg && <div>{ infoMsg }</div> }

      { chats?.length ? chats.map((chat, idx) => (
          <ChatSummaryCard
            key={idx}
            title={chat.title}
            lastMessageAt={chat.lastMessageAt}
            chatType={chat.chatType}
            chatId={chat.chatId}
          />
        )): <div>No Chats!</div>
      }
    </div>
  )
}