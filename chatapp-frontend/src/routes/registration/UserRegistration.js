import { Box, Button, FormControl, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { SERVER_URL } from "../../utils/Constants";
import UserContext from "../../utils/UserContext";
import "../login/loginpage.css";

const UserRegistration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();
  const { currentUser, logoutUser } = useContext(UserContext);

  useEffect(() => {
    console.log("currentUser", currentUser);
    if (currentUser !== null) {
      history.push("/conversation");
    }
  }, [currentUser]);

  const updateUsername = (event) => {
    setUsername(event.target.value);
  };

  const updatePassword = (event) => {
    setPassword(event.target.value);
  };

  const saveUser = async () => {
    const userToSave = {
      username: username,
      password: password,
    };
    try {
      await axios.post(SERVER_URL + "/users", userToSave, {
        withCredentials: true,
      });
      history.push("/login");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
    }
  };

  return (
    <div className="fullWidth fullHeight alignCenter loginBody">
      <Box className="loginPaper">
        <h2>Registration</h2>
        <FormControl className="loginForm">
          <Box className="textFieldContainer">
            <TextField
              value={username}
              label="Username"
              className="loginPageTextField"
              variant="outlined"
              onChange={updateUsername}
            />
            <TextField
              value={password}
              label="Password"
              onChange={updatePassword}
              className="loginPageTextField"
              variant="outlined"
              type="password"
            />
          </Box>
          <Box className="loginPageButtonContainer">
            <Button
              variant="outlined"
              className="loginPageButton"
              color="primary"
              onClick={saveUser}
            >
              Save
            </Button>
            <Button
              className="loginPageButton"
              variant="outlined"
              color="secondary"
              onClick={() => history.push("/login")}
            >
              Login
            </Button>
          </Box>
        </FormControl>
      </Box>
    </div>
  );
};

export default UserRegistration;
