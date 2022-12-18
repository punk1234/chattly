import "./SendChatMessage.css";

function SendChatMessage() {
  return (
    <div className="SendChatMessage">
      <textarea
        // rows={3}
        // wrap="off"
        placeholder="Chat message goes here..."
      />
      
      <button>SEND</button>
    </div>
  )
}

export default SendChatMessage;