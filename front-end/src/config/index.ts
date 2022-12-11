// const { env } = process;

export default {
  APP_NAME: "Chattly",
  // CHATTLY_API_BASE_URL: env.CHATTLY_API_BASE_URL || "127.0.0.1:8899",
  CHATTLY_API_BASE_URL: "http://127.0.0.1:8899",
  LOCAL_STORAGE_KEY: {
    AUTH_TOKEN: "auth_token",
    USER_DATA: "user_data"
  }
}