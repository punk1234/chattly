import "./ChatMessagesView.css";

interface IProps {
  messages: Array<any> | null;
}

export function ChatMessagesView(props: IProps) {
  return (
    <div className="ChatMessagesView">
      <div>ChatMessagesView {/**JSON.stringify(props.messages)*/}</div>

      <div>
        {
          props.messages?.length ? props.messages.map((item, idx) => (
            <div key={idx}>
              { item.messages[0].content }
              <br />
              { item.messages[0].createdAt }
            </div>
          )) : "No Chat Selected!"
        }
      </div>
    </div>
  )
}