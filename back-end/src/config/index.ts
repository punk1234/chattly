import C from "../constants";
import { config as getEnvVariables } from "dotenv";

getEnvVariables();

const { env } = process;

export default {
  PORT: Number(env.PORT || 8000),
  WEB_SOCKET_PORT: Number(env.WEB_SOCKET_PORT || 8900),
  ENVIRONMENT: env.NODE_ENV || C.Environment.DEVELOPMENT,
  MONGODB_URL: env.MONGODB_URL || "",
  JWT_TOKEN_SECRET: env.JWT_TOKEN_SECRET || "",
  AUTH_TOKEN_TTL_IN_HOURS: `${env.AUTH_TOKEN_TTL_IN_HOURS || "6"}h`,
  MAX_MESSAGES_PER_TOP_CHATS: 50,
};
