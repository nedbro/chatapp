import { Button } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { SERVER_URL } from "../../utils/Constants";
import UserContext from "../../utils/UserContext";

const LoginPage = ({ saveLoggedInUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (currentUser !== null) {
      history.push("/conversation");
    }
  }, [currentUser]);

  const login = async () => {
    const data = {
      username: username,
      password: password,
    };
    try {
      const loginResponse = await axios.post(SERVER_URL + "/auth/login", data, {
        withCredentials: true,
      });
      saveLoggedInUser(loginResponse.data);
      history.push("/conversation");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form>
        <Input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <br />
        <Input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
        />
        <Button onClick={login}>Login</Button>
        <Button> <Link to="/registration">Register</Link></Button>
      </form>
    </div>
  );
};

export default LoginPage;
