import express from "express";
import { Container } from "typedi";
import { requireAuth } from "../middlewares";
import { AuthController } from "../controllers/auth.controller";

const router = express.Router();
const controller = Container.get(AuthController);

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/logout", requireAuth(), controller.logout);

export default router;
