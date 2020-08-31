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

  const login = () => {
    const data = {
      username: username,
      password: password
    };

    axios.post(SERVER_URL + "/auth/login", data, { withCredentials: true }).then((result) => {
      console.log("result", result);
      localStorage.setItem("user", JSON.stringify(result.data));
      history.push("/conversation");
    });
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
