import "./ChatMessageCard.css";

interface IProps {
  isMine: boolean;
  content: string;
  dateTime: string;
}

export function ChatMessageCard(props: IProps) {
  return (
    <div
      className="ChatMessageCard"
      style={{ float: props.isMine ? "right" : "left", clear: "both" }}
    >
      { props.content }<br />
      <span className="ChatMessageCard__date_time">{ new Date(props.dateTime).toLocaleString() }</span>
    </div>
  )
}