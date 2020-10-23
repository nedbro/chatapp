import { Box, Button, FormControl, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../utils/AuthProvider";
import { SERVER_URL } from "../../utils/Constants";
import "./auth.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();
  const { setSignedInUser } = useContext(AuthContext);

  const login = () => {
    const data = {
      username: username,
      password: password,
    };

    axios
      .post(SERVER_URL + "/auth/login", data, {
        withCredentials: true,
      })
      .then((response) => {
        setSignedInUser(response.data);
        history.push("/conversation");
      })
      .catch(console.warn);
  };

  return (
    <div className="fullWidth fullHeight alignCenter loginBody">
      <Box className="loginPaper">
        <h2>Login</h2>
        <FormControl className="loginForm">
          <Box className="textFieldContainer">
            <TextField
              value={username}
              label="Username"
              className="loginPageTextField"
              variant="outlined"
              onChange={(event) => setUsername(event.target.value)}
            />
            <TextField
              value={password}
              label="Password"
              className="loginPageTextField"
              variant="outlined"
              type="password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </Box>
          <Box className="loginPageButtonContainer">
            <Button
              variant="outlined"
              className="loginPageButton"
              color="primary"
              onClick={login}
            >
              Login
            </Button>
            <Button
              className="loginPageButton"
              variant="outlined"
              color="secondary"
              onClick={() => history.push("/registration")}
            >
              Register
            </Button>
          </Box>
        </FormControl>
      </Box>
    </div>
  );
};

export default LoginPage;
