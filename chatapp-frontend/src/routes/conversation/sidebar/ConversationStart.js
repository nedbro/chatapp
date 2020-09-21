import { Grid, Paper, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SERVER_URL } from "../../../utils/Constants";
import UserContext from "../../../utils/UserContext";
import "../conversation.css";

const ConversationStart = ({ startConversation }) => {
  const [newConversationCards, setNewConversationCards] = useState("");
  const { currentUser, logoutUser } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (currentUser === null) {
      logoutUser();
    } else {
      axios
        .get(
          SERVER_URL + "/users/" + currentUser["_id"] + "/newConversations",
          {
            withCredentials: true,
          }
        )
        .then((result) => createUserCards(result.data))
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            logoutUser();
            history.push("/login");
          }
        });
    }
  }, []);

  const createUserCards = (users) => {
    const userList = [];

    users.forEach((user) => {
      userList.push(
        <Grid
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
        </Grid>
      );
    });

    setNewConversationCards(userList);
  };

  return <>{newConversationCards}</>;
};

export default ConversationStart;
