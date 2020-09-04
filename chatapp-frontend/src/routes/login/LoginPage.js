import React, { useEffect, useState } from "react";
import Input from "@material-ui/core/Input";
import { Button } from "@material-ui/core";
import axios from "axios";
import { SERVER_URL } from "../../utils/Constants";
import { useHistory } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (user !== null) {
      history.push("/conversation");
    }
  }, []);

  const login = async () => {
    const data = {
      username: username,
      password: password
    };
    try {
      const loginResponse = await axios.post(SERVER_URL + "/auth/login", data, { withCredentials: true });
      localStorage.setItem("user", JSON.stringify(loginResponse.data));
      history.push("/conversation");
    } catch (error) {
      console.log(error);
    }
  };

  return (<div>
      <form>
        <Input value={username} onChange={(event) => setUsername(event.target.value)} />
        <br />
        <Input value={password} onChange={(event) => setPassword(event.target.value)} />
        <Button onClick={login}>Login</Button>
      </form>
    </div>
  );
};


export default LoginPage;
