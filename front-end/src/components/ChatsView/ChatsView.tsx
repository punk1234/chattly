import { useEffect, useState } from "react";
import { apiHandler } from "../../helpers";
import { IChatSummary } from "../../interfaces";
import ChatSummaryCard from "../ChatSummaryCard/ChatSummaryCard";
import "./ChatsView.css";

interface IProps {
  chats?: Array<IChatSummary>;
  infoMsg: string;
  setActiveChatHandler: Function;
}

export function ChatsView(props: IProps) {
  // const [chats, setChats] = useState<Array<IChatSummary> | null>(null);

  const fetchChatsFromApi = async () => {
    // const [success, data] = await apiHandler.sendWithAuthToken(
    //   "GET",
    //   "/me/chats"
    // );

    // success ?
    //   setChats(data.records) :
    //   setInfoMsg((data as any)?.message);

    // const entityIds = props.chats?.map((item: any) => item.chatId);
    // const [msgSuccess, msgData] = await apiHandler.sendWithAuthToken(
    //   "POST",
    //   "/me/top-chats/messages",
    //   { entityIds }
    // );

    // console.log(msgData);

    // msgSuccess ?
    //   props.setChatsMessagesHandler(msgData.records) :
    //   setInfoMsg((msgData as any)?.message);
  }

  useEffect(() => {
    fetchChatsFromApi();
  }, []);
  
  return (
    <div className="ChatsView">
      <div>ChatsView</div>

      { props.infoMsg && <div>{ props.infoMsg }</div> }

      { props.chats?.length ? props.chats.map((chat, idx) => (
          <ChatSummaryCard
            key={idx}
            title={chat.title}
            lastMessageAt={chat.lastMessageAt}
            chatType={chat.chatType}
            chatId={chat.chatId}
            onClickHandler={props.setActiveChatHandler}
          />
        )): <div>No Chats!</div>
      }
    </div>
  )
}