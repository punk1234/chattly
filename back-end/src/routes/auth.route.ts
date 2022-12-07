import express from "express";
import { Container } from "typedi";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares";

const router = express.Router();
const controller = Container.get(AuthController);

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/logout", requireAuth(), controller.logout);

export default router;
