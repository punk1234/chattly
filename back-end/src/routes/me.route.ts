import express from "express";
import { Container } from "typedi";
import { requireAuth } from "../middlewares";
import { UserController } from "../controllers/user.controller";
import { ChatController } from "../controllers/chat.controller";

const router = express.Router();
const controller = Container.get(UserController);
const chatController = Container.get(ChatController);

router.get("/profile", requireAuth(), controller.getProfile);

router.post("/single-chat/connection", requireAuth(), chatController.initiateSingleChatConnection);

router.post("/group-chats", requireAuth(), chatController.createGroupChat);

router.patch("/group-chats/:groupChatId", requireAuth(), chatController.updateGroupChat);

router.post("/chat-message/send", requireAuth(), chatController.sendChatMessage);

router.get("/chats", requireAuth(), chatController.getChats);

router.post("/top-chats/messages", requireAuth(), chatController.getTopChatsMessages);

export default router;
