import { useEffect, useState } from "react";
import "./CreateGroupChatModal.css";

interface IProps {
  open: boolean;
  onCloseModalHandler: Function;
}

export function CreateGroupChatModal(props: IProps) {
  const [groupChatName, setGroupChatName] = useState<string>("");
  const [groupChatMember, setGroupChatMember] = useState<string>("");
//   const [isOpen, setIsOpen] = useState<boolean>(false);

//   console.log("@@@---" + props.open + "---" + isOpen)

  const onCloseHandler = () => {
    props.onCloseModalHandler();
  }

//   useEffect(() => {
//     console.log("@@@" + props.open)
//     setIsOpen(true);
//   }, []);

  return (
    (!props.open) ? <></> : <div className="CreateGroupChatModal" onClick={onCloseHandler}>
      <div className="CreateGroupChatModal__main" onClick={(e) => e.stopPropagation()}>
        <h1>Create Group Chat</h1>

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
                // onClick={handleCreateGroupChat}
                disabled={!groupChatName || !groupChatMember}
            />
        </form>
      </div>
    </div>
  );
}