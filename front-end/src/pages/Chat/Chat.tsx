import "./Chat.css";
import { useEffect, useState } from "react";
import config from "../../config";
import { apiHandler, appStorage, LocalStorage, RealTimeEventRegistrar } from "../../helpers";
import { IChatSummary, IRTNewGroupChatPayload, IRTNewMessagePayload } from "../../interfaces";
import { ChatMessagesView, ChatsView, CreateGroupChatModal, Header, InitiateSingleChatModal } from "../../components";

// NOTE: MOVING THIS OUT OF THE COMPONENT MADE IT WORK
const CHATS_MAP: Record<string, Array<any>> = {};
const LATEST_CHATS: { chats: any } = { chats: undefined };

export function Chat() {
  // THINKING: SHOULD GET CHATS-MESSAGES BE DONE HERE ? SINCE THIS HAPPENS ONCE
  const [chatsMessages, setChatsMessages] = useState<Array<any>>();
  const [chats, setChats] = useState<Array<IChatSummary>>();

  const [activeChat, setActiveChat] = useState<any>(null);
  const [activeChatMessages, setActiveChatMessages] = useState<Array<any>>();

  const [showCreateGroupChatModal, setShowCreateGroupChatModal] = useState<boolean>(false);
  const [showInitiateSingleChatModal, setShowInitiateSingleChatModal] = useState<boolean>(false);

  const [infoMsg, setInfoMsg] = useState("");

  // const CHATS_MAP: Record<string, Array<any>> = {};

  LATEST_CHATS.chats = chats;

  const onNewChatMessageHandler = (data: IRTNewMessagePayload) => {
    // THIS HANDLES BOTH SINGLE & GROUP CHAT MESSAGES UPDATES
    if(!LATEST_CHATS.chats?.length) {
      return; // IGNORE FOR NOW
    }

    // UPDATE REFERENCED CHAT POSITION IN CHAT-LIST (PROBABLY GOING TO THE TOP OF CHATS)
    const CHAT_INDEX = LATEST_CHATS.chats?.findIndex((item: IChatSummary) => item.chatId === data.chatId);
    
    const NEW_CHATS = [...LATEST_CHATS.chats];
    const CHAT = NEW_CHATS.splice(CHAT_INDEX, 1)[0];

    CHAT.lastMessageAt = data.messageAt;
    setChats([ CHAT, ...NEW_CHATS ]); // PUSH ITEM INTO LIST

    // UPDATE REFERENCED CHAT MESSAGES
  };

  const onNewGroupChatHandler = (data: IRTNewGroupChatPayload) => {};

  try {
    !chats?.length && RealTimeEventRegistrar.sync(
      config.CHATTLY_WEBSOCKET_BASE_URL,
      (appStorage.get(LocalStorage.USER_DATA_KEY) as any).username,
      {
        onNewChatMessageHandler,
        onNewGroupChatHandler
      }
    );

    // setTimeout(() => {
    //   onNewChatMessageHandler({
    //     chatId: "9de37e78-24a8-4910-a0b8-256a4d0a00dc",
    //     message: "Hmmm, testing websocket from front-end...!",
    //     messageAt: new Date().toISOString(),
    //     sender: "abcd"
    //   });
    // }, 5000);
  } catch(err) {
    console.error("Real-Time Functionality N/A. Kindly re-fresh page again!!!");
  }

  const fetchChatsFromApi = async () => {
    const [success, data] = await apiHandler.sendWithAuthToken(
      "GET",
      "/me/chats"
    );

    success ?
      setChats(data.records) :
      setInfoMsg((data as any)?.message);

    const entityIds = data.records?.map((item: any) => item.chatId);
    const [msgSuccess, msgData] = await apiHandler.sendWithAuthToken(
      "POST",
      "/me/top-chats/messages",
      { entityIds }
    );
  
    console.log(msgData);

    msgSuccess ?
      setChatsMessages(msgData.records) :
      setInfoMsg((msgData as any)?.message);
  };

  useEffect(() => {
    fetchChatsFromApi();
  }, []);

  useEffect(() => {
    chatsMessages?.forEach(chatWithMessages => {
      CHATS_MAP[chatWithMessages["id"]] = chatWithMessages["messages"].reverse();
    });
  }, [chatsMessages]);

  useEffect(() => {
    setActiveChatMessages(CHATS_MAP[activeChat?.chatId]);
  }, [activeChat]);

  return (
    <div className="Chat">
      <Header
        onCreateGroupChatHandler={() => setShowCreateGroupChatModal(true)}
        onInitiateSingleChatHandler={() => setShowInitiateSingleChatModal(true)}
      />

      <div className="Chat__board">
        <ChatsView
          chats={chats}
          infoMsg={infoMsg}
          setActiveChatHandler={setActiveChat}
        />

        <ChatMessagesView
          messages={activeChatMessages}
          recipientID={activeChat?.singleChatUsername || activeChat?.chatId}
          chatType={activeChat?.chatType}
        />
      </div>

      {/* NOTE: CAN ALSO USE `open && <CreateGroupChatModal .../> component here. Might be cleaner`*/}
      <CreateGroupChatModal
        open={showCreateGroupChatModal}
        onCloseModalHandler={() => setShowCreateGroupChatModal(false)}
      />

      <InitiateSingleChatModal
        open={showInitiateSingleChatModal}
        onCloseModalHandler={() => setShowInitiateSingleChatModal(false)}
      />
    </div>
  );
};