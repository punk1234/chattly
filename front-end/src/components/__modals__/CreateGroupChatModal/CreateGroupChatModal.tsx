import { useState } from "react";
import { InfoMsg } from "../../InfoMsg/InfoMsg";
import { apiHandler } from "../../../helpers";
import "./CreateGroupChatModal.css";

interface IProps {
  open: boolean;
  onCloseModalHandler: Function;
}

export function CreateGroupChatModal(props: IProps) {
  const [infoMsg, setInfoMsg] = useState("");
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [groupChatMember, setGroupChatMember] = useState<string>("");

  const onCloseHandler = () => {
    props.onCloseModalHandler();
  }

  const handleCreateGroupChat = async (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();

    const [success, data] = await apiHandler.sendWithAuthToken(
      "POST",
      "/me/group-chats",
      { name: groupChatName, members: [groupChatMember] }
    );
  
    success ?
      setInfoMsg("Group chat created successfully!") :
      setInfoMsg((data as any)?.message);
  }

  return (
    (!props.open) ? <></> : <div className="CreateGroupChatModal" onClick={onCloseHandler}>
      <div className="CreateGroupChatModal__main" onClick={(e) => e.stopPropagation()}>
        <h1>Create Group Chat</h1>

        <InfoMsg content={infoMsg} />

        <form>
          <label htmlFor="groupChatName">Group Chat Name</label>
          <input
            type="text"
            id="groupChatName"
            onChange={(evt) => setGroupChatName(evt.target.value)}
          />

          <label htmlFor="groupChatMember">Group Chat Member</label>
          <input
            type="text"
            id="groupChatMember"
            onChange={(evt) => setGroupChatMember(evt.target.value)}
          />

          <input
            type="submit"
            value="CREATE"
            onClick={handleCreateGroupChat}
            disabled={!groupChatName || !groupChatMember}
          />
        </form>
      </div>
    </div>
  );
}