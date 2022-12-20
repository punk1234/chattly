import "./InitiateSingleChatModal.css";

import { useState } from "react";
import { InfoMsg } from "../../InfoMsg/InfoMsg";
import { apiHandler } from "../../../helpers";

interface IProps {
  open: boolean;
  onCloseModalHandler: Function;
}

export function InitiateSingleChatModal(props: IProps) {
  const [infoMsg, setInfoMsg] = useState("");
  const [singleChatMember, setSingleChatMember] = useState<string>("");

  const onCloseHandler = () => {
    props.onCloseModalHandler();
  }

  const handleInitiateSingleChat = async (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();

    const [success, data] = await apiHandler.sendWithAuthToken(
      "POST",
      "/me/single-chat/connection",
      { newConnectUsername: singleChatMember }
    );
  
    success ?
      setInfoMsg("Single chat initiated successfully!") :
      setInfoMsg((data as any)?.message);
  }

  return (
    (!props.open) ? <></> : <div className="InitiateSingleChatModal" onClick={onCloseHandler}>
      <div className="InitiateSingleChatModal__main" onClick={(e) => e.stopPropagation()}>
        <h1>Initiate Single Chat</h1>

        <InfoMsg content={infoMsg} />

        <form>
          <label htmlFor="singleChatMember">Group Chat Member</label>
          <input
            type="text"
            id="singleChatMember"
            onChange={(evt) => setSingleChatMember(evt.target.value)}
          />

          <input
            type="submit"
            value="INITIATE"
            onClick={handleInitiateSingleChat}
            disabled={!singleChatMember}
          />
        </form>
      </div>
    </div>
  );
}