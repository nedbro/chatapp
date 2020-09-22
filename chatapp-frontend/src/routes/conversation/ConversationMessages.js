import { Button, Grid, TextField } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Typography from "@material-ui/core/Typography";
import React, { useContext, useState } from "react";
import UserContext from "../../utils/UserContext";
import "./conversation.css";

const ConversationMessages = ({
  currentConversation,
  sendMessage,
  messagesVisible,
}) => {
  const { currentUser, logoutUser } = useContext(UserContext);
  const [messageToSend, setMessageToSend] = useState("");
  const messageList = currentConversation.messages.map((message) => {
    return (
      <Grid item container className="fullWidth" key={message["_id"]}>
        <Grid
          item
          xs={12}
          container
          justify={
            (currentUser ? currentUser["_id"] : null) === message.sender
              ? "flex-end"
              : "flex-start"
          }
        >
          <Chip label={message.text} className="message" />
        </Grid>
      </Grid>
    );
  });

  const updateMessageToSend = (event) => {
    setMessageToSend(event.target.value);
  };

  const handleSendClick = () => {
    sendMessage(messageToSend);
    setMessageToSend("");
  };

  return (
    <Grid
      item
      container
      xs={10}
      justify="center"
      alignItems="center"
      className="fullHeight"
    >
      <Grid item container xs={6} className="fullHeight messageListWrapper" direction="column">
        {messageList && messagesVisible ? (
          <>
            <Grid
              item
              xs={10}
              container
              direction="column-reverse"
              alignItems="stretch"
              spacing={2}
              className="fullWidth messageList"
            >
              {messageList.reverse()}
            </Grid>
            <Grid item>
              <TextField
                value={messageToSend}
                onChange={updateMessageToSend}
                mr={2}
              />
              <Button variant="contained" onClick={handleSendClick}>
                Send
              </Button>
              <Button onClick={logoutUser}>Logout</Button>
            </Grid>
          </>
        ) : (
          <Grid
            item
            container
            xs={6}
            className="fullHeight fullWidth"
            alignItems="flex-end"
            justify="center"
          >
            <Typography variant="h3" gutterBottom align="center">
              Start a new conversation or select and existing one
            </Typography>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
};

export default ConversationMessages;
