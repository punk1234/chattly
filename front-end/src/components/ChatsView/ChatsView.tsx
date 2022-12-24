import { IChatSummary } from "../../interfaces";
import ChatSummaryCard from "../ChatSummaryCard/ChatSummaryCard";
import "./ChatsView.css";

interface IProps {
  chats?: Array<IChatSummary>;
  infoMsg: string;
  setActiveChatHandler: Function;
}

export function ChatsView(props: IProps) {
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