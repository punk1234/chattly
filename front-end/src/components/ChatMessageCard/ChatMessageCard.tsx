import { appStorage, LocalStorage } from "../../helpers";
import "./ChatMessageCard.css";

interface IProps {
  senderUsername: string;
  content: string;
  dateTime: string;
}

const AUTH_USERNAME = appStorage.get(LocalStorage.USER_DATA_KEY).username;

export function ChatMessageCard(props: IProps) {
  return (
    <div
      className="ChatMessageCard"
      style={{ float: (props.senderUsername === AUTH_USERNAME) ? "right" : "left", clear: "both" }}
    >
      { props.content }<br />
      <span className="ChatMessageCard__date_time">{ new Date(props.dateTime).toLocaleString() }</span>
    </div>
  )
}