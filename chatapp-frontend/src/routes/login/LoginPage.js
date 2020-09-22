import { Button, FormControl, TextField } from "@material-ui/core";
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
    <div className="fullWidth fullHeight alignCenter">
      <div>
        <FormControl>
          <TextField
            value={username}
            label="Username"
            onChange={(event) => setUsername(event.target.value)}
            m={1}
          />
          <br />
          <TextField
            value={password}
            label="Password"
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            m={1}
          />
          <Button onClick={login}>Login</Button>
          <Button>
            <Link to="/registration">Register</Link>
          </Button>
        </FormControl>
      </div>
    </div>
  );
};

export default LoginPage;
