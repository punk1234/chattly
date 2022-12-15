import { IChatSummary } from "../../interfaces";
import "./ChatSummaryCard.css";

function ChatSummaryCard(props: IChatSummary) {
  return (
    <div className="ChatSummaryCard">
      <div><strong>{props.title}</strong></div>
      <div className="ChatSummaryCard__last_message_at">{new Date(props.lastMessageAt).toDateString()}</div>
    </div>
  )
}

export default ChatSummaryCard;