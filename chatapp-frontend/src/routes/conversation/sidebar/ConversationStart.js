import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../../utils/Constants";
import { Grid, Paper, Typography } from "@material-ui/core";
import "../conversation.css";
import { useHistory } from "react-router-dom";

const ConversationStart = ({ currentUser, startConversation }) => {
  const [newConversationCards, setNewConversationCards] = useState("");
  const history = useHistory();

  useEffect(() => {
    axios.get(SERVER_URL + "/users/" + currentUser["_id"] + "/newConversations", { withCredentials: true })
      .then(result => createUserCards(result.data))
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("user");
          history.push("/login");
        }
      });
  }, []);

  const createUserCards = (users) => {
    const userList = [];

    users.forEach((user) => {
      userList.push(<Grid
        item
        container
        direction="row"
        xs={1}
        className="fullWidth"
        key={user["_id"]}
        justify="center"
        alignItems="center"
      >
        <Paper className="userPaper" onClick={() => startConversation(user)}>
          <Typography variant="h6" gutterBottom>
            {user.username}
          </Typography>
        </Paper>
      </Grid>);
    });

    setNewConversationCards(userList);
  };

  return (<>{newConversationCards}</>);

};

export default ConversationStart;
