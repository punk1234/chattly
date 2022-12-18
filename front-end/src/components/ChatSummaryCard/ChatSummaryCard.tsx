import { ChatType, IChatSummary } from "../../interfaces";
import "./ChatSummaryCard.css";

type IProps = IChatSummary & { onClickHandler: Function };

function ChatSummaryCard(props: IProps) {
  const onClickHandler = () => {
    props.onClickHandler({
      chatType: props.chatType,
      chatId: (props.chatType === ChatType.S) ? props.title : props.chatId,
    });
  };

  return (
    <div className="ChatSummaryCard" onClick={onClickHandler}>
      <img className="ChatSummaryCard__image" src="" />

      <div>
        <strong>{props.title}</strong>
      </div>

      <div className="ChatSummaryCard__last_message_at">{new Date(props.lastMessageAt).toDateString()}</div>
    </div>
  )
}

export default ChatSummaryCard;