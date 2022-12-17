import { ChatMessageCard } from "../ChatMessageCard/ChatMessageCard";
import "./ChatMessagesView.css";

interface IProps {
  messages: Array<any> | null;
}

export function ChatMessagesView(props: IProps) {
  return (
    <div className="ChatMessagesView">
      <div>ChatMessagesView {/**JSON.stringify(props.messages)*/}</div>

      <div>
        {
          props.messages?.length ? props.messages.reverse().map((item, idx) => (
            <ChatMessageCard
              key={idx}
              isMine={true}
              content={item.messages[0].content}
              dateTime={item.messages[0].createdAt}
            />
          )) : "No Chat Selected!"
        }
      </div>
    </div>
  )
}