import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AppMessage } from "../../constants";
import { apiHandler } from "../../helpers";
import "./SignUp.css";

export function SignUp() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async (event: React.MouseEvent<HTMLInputElement>) => {
    event.preventDefault();

    const signUpData = {
      username,
      email,
      password,
    };

    const [success, response] = await apiHandler.send(
      "POST", 
      "/auth/register",
      signUpData
    );

    success ?
      setInfoMsg("Account created successfully!!!") :
      setInfoMsg((response as any)?.message);

    if(success) {
      navigate("/login");
    }
  };

  useEffect(() => {
    setInfoMsg(
      (password !== confirmPassword) ? AppMessage.ERR_PASSWORDS_MISMATCH : ""
    );


  }, [password, confirmPassword]);

  return (
    <div className="SignUp">
      <h1>CREATE ACCOUNT</h1>

      {
        infoMsg
        &&
        <div className="SignUp__info_msg">{infoMsg}</div>
      }

      <form autoComplete="new-password">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" required={true} onChange={(evt) => setUsername(evt.target.value)} />

        <label htmlFor="email">Email</label>
        <input type="text" id="email" onChange={(evt) => setEmail(evt.target.value)} />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" placeholder="********" onChange={(evt) => setPassword(evt.target.value)} />
        <input type="password" id="cfmpassword" placeholder="********" onChange={(evt) => setConfirmPassword(evt.target.value)} />

        <input 
          type="submit"
          value="CREATE ACCOUNT" 
          onClick={handleSignUp}
          disabled={!(username && email && password.length > 3 && password === confirmPassword)}
        />
      </form>

      <a href="/login">
        Already have an account? Login
      </a>
    </div>
  );
};