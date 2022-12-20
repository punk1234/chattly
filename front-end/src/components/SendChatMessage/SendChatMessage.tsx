import { useState } from "react";
import { apiHandler } from "../../helpers";
import { ChatType } from "../../interfaces";
import "./SendChatMessage.css";

interface IProps {
  recipientID: string;
  recipientType: ChatType;
}

export function SendChatMessage(props: IProps) {
  const [chatMsg, setChatMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const handleSendMessage = async () => {
    const [success, data] = await apiHandler.sendWithAuthToken(
      "POST",
      "/me/chat-message/send",
      {
        content: chatMsg,
        recipientID: props.recipientID,
        recipientType: props.recipientType
      }
    );
  
    success ?
      setChatMsg("@DONE") :
      setInfoMsg((data as any)?.message);
  }

  return (
    <div className="SendChatMessage">
      { infoMsg && <div>{ infoMsg }</div> }

      <textarea
        // rows={3}
        // wrap="off"
        value={chatMsg}
        placeholder="Chat message goes here..."
        onChange={(evt) => setChatMsg(evt.target.value)}
      />
      
      <button onClick={handleSendMessage}>SEND</button>
    </div>
  );
}