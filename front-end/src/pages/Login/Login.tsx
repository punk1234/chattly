import { useState } from "react";
import { useNavigate } from "react-router";
import config from "../../config";
import { apiHandler, appStorage, LocalStorage } from "../../helpers";
import { LoginResponse } from "../../interfaces/requests-responses";
import "./Login.css";

export function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();

    const userIdKey = usernameOrEmail.includes("@") ? "email" : "username";
    const loginData = { [userIdKey]: usernameOrEmail, password };

    const [success, response] = await apiHandler.send(
      "POST", 
      "/auth/login",
      loginData
    );

    success ?
      setInfoMsg("User login was successful!!!") :
      setInfoMsg((response as any)?.message);

    if(success) {
      handleSuccessfulLoginDataCapture(response);
      navigate(("/chat"));
    }
  };

  const handleSuccessfulLoginDataCapture = (loginResponse: LoginResponse) => {
    appStorage.save(LocalStorage.AUTH_TOKEN_KEY, loginResponse.token);
    appStorage.save(LocalStorage.USER_DATA_KEY, loginResponse.user);
  }

  return (
    <div className="Login">
      <h1>LOGIN</h1>

      {
        infoMsg
        &&
        <div className="Login__info_msg">{infoMsg}</div>
      }

      <form>
        <label htmlFor="usernameOrEmail">User ID <em>(username or email)</em></label>
        <input
          type="text"
          id="usernameOrEmail"
          onChange={(evt) => setUsernameOrEmail(evt.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="********" onChange={(evt) => setPassword(evt.target.value)} />

        <input 
          type="submit"
          value="LOGIN"
          onClick={handleLogin}
          disabled={!usernameOrEmail || password.length < 4}
        />
      </form>

      <a href="/create-account">
        Don't have an account yet? Create Account
      </a>
    </div>
  )
};