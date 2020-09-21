import { Button, Grid } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SERVER_URL } from "../../utils/Constants";
import UserContext from "../../utils/UserContext";

const UserRegistration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();
  const { currentUser, logoutUser } = useContext(UserContext);

  useEffect(() => {
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
    <Grid container item xs={6} direction="column">
      <Input value={username} onChange={updateUsername} />
      <Input value={password} onChange={updatePassword} type="password" />
      <Button variant="contained" onClick={saveUser}>
        Save
      </Button>
    </Grid>
  );
};

export default UserRegistration;
