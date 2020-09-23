import { Box, Button, FormControl, Paper, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { SERVER_URL } from "../../utils/Constants";
import UserContext from "../../utils/UserContext";
import "./loginpage.css";

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
