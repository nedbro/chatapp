import { Box, Button, FormControl, TextField } from "@material-ui/core";
import Axios from "axios";
import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../utils/AuthProvider";
import { SERVER_URL } from "../../utils/Constants";
import "./auth.css";

const UserRegistration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();
  const { setSignedInUser } = useContext(AuthContext);

  const updateUsername = (event) => {
    setUsername(event.target.value);
  };

  const updatePassword = (event) => {
    setPassword(event.target.value);
  };

  const saveUser = () => {
    const userToSave = {
      username: username,
      password: password,
    };

    Axios.post(SERVER_URL + "/users", userToSave, {
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
