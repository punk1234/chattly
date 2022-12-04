import C from "../constants";
import { config as getEnvVariables } from "dotenv";

getEnvVariables();

const { env } = process;

export default {
  PORT: Number(env.PORT || 8000),
  ENVIRONMENT: env.NODE_ENV || C.Environment.DEVELOPMENT,
  MONGODB_URL: env.MONGODB_URL || "",
};
