import React, { useEffect, useState } from "react";
import Input from "@material-ui/core/Input";
import { Button, Grid } from "@material-ui/core";
import axios from "axios";
import { SERVER_URL } from "../../utils/Constants";
import { useHistory } from "react-router-dom";

const UserRegistration = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (user !== null) {
      history.push("/conversation");
    }
  }, []);

  const updateUsername = (event) => {
    setUsername(event.target.value);
  };

  const updatePassword = (event) => {
    setPassword(event.target.value);
  };

  const saveUser = () => {
    const userToSave = {
      username: username,
      password: password
    };

    axios
      .post(SERVER_URL + "/users", userToSave)
      .then((response) => console.log("user mentés sikeres volt"));
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
