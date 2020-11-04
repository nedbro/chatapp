import { Box, Paper, Typography } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../utils/AuthProvider";
import { SERVER_URL } from "../../../utils/Constants";
import "./sidebar.css";

const ConversationStart = ({ startConversation }) => {
  const [newConversationCards, setNewConversationCards] = useState("");
  const { signedInUser, setSignedInUser } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(SERVER_URL + "/users/" + signedInUser["_id"] + "/newConversations", {
        withCredentials: true,
      })
      .then((result) => createUserCards(result.data))
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setSignedInUser(null);
        }
      });
  }, []);

  const createUserCards = (users) => {
    const userList = [];

    users.forEach((user) => {
      userList.push(
        <Box
          display="flex"
          className="conversationBoxContainer"
          key={user["_id"]}
          justify="center"
          alignItems="center"
        >
          <Paper
            className="sidebarPaper"
            onClick={() => startConversation(user)}
          >
            <Typography variant="h6" gutterBottom>
              {user.username}
            </Typography>
          </Paper>
        </Box>
      );
    });

    setNewConversationCards(userList);
  };

  return <>{newConversationCards}</>;
};

export default ConversationStart;
