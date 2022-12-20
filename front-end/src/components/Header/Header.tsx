import "./Header.css";

interface IProps {
  onCreateGroupChatHandler: Function;
}

export function Header(props: IProps) {
  return (
    <div className="Header">
      Chattly

      <button onClick={() => props.onCreateGroupChatHandler()}>
        CREATE GROUP-CHAT
      </button>
    </div>
  );
}