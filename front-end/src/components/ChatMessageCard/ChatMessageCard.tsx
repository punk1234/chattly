import "./ChatMessageCard.css";

interface IProps {
  isMine: boolean;
  content: string;
  dateTime: Date;
}

export function ChatMessageCard(props: IProps) {
  return (
    <div
      className="ChatMessageCard"
      style={{ float: props.isMine ? "right" : "left", clear: "both" }}
    >
      { props.content }
    </div>
  )
}