import { ChatType } from "../../interfaces";
import { ChatMessageCard } from "../ChatMessageCard/ChatMessageCard";
import { SendChatMessage } from "../SendChatMessage/SendChatMessage";
import "./ChatMessagesView.css";

interface IProps {
  messages?: Array<any>;
  recipientID: string;
  chatType: ChatType;
}

export function ChatMessagesView(props: IProps) {
  return (
    <div className="ChatMessagesView">
      <div>ChatMessagesView {/**JSON.stringify(props.messages)*/}</div>

      <div className="ChatMessagesView__message_box">
        {
          props.messages?.length ? props.messages.map((item, idx) => (
            <ChatMessageCard
              key={idx}
              isMine={true}
              content={item.content}
              dateTime={item.createdAt}
            />
          )) : "No Chat Selected!"
        }
      </div>

      {/* <div className="ChatMessagesView__send_message_box" style={{ clear: "both" }}> */}
      {
        props.chatType
        &&
        <SendChatMessage
          recipientID={props.recipientID}
          recipientType={props.chatType}
        />
      }
      {/* </div> */}
    </div>
  )
}