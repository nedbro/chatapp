import { Button, FormControl, TextField } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { SERVER_URL } from "../../utils/Constants";
import UserContext from "../../utils/UserContext";

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
    <div className="fullWidth fullHeight alignCenter">
      <div>
        <FormControl>
          <TextField value={username} onChange={updateUsername} />
          <TextField
            value={password}
            onChange={updatePassword}
            type="password"
          />
          <Button variant="contained" onClick={saveUser}>
            Save
          </Button>
          <Button>
            <Link to="/login">Login</Link>
          </Button>
        </FormControl>
      </div>
    </div>
  );
};

export default UserRegistration;
