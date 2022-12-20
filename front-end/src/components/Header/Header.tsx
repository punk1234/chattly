import "./Header.css";

interface IProps {
  onCreateGroupChatHandler: Function;
  onInitiateSingleChatHandler: Function;
}

export function Header(props: IProps) {
  return (
    <div className="Header">
      Chattly

      <button onClick={() => props.onCreateGroupChatHandler()}>
        CREATE GROUP-CHAT
      </button>

      <button onClick={() => props.onInitiateSingleChatHandler()}>
        INITIATE SINGLE-CHAT
      </button>
    </div>
  );
}