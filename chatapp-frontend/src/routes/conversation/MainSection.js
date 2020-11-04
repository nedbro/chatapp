import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../utils/AuthProvider";
import "./conversation.css";

const MainSection = ({ currentConversation, sendMessage }) => {
  const { signedInUser } = useContext(AuthContext);
  const [messageToSend, setMessageToSend] = useState("");

  let messageList = [];

  if (currentConversation && currentConversation.messages) {
    messageList = currentConversation.messages.map((message) => {
      return (
        <Grid item container className="fullWidth" key={message["_id"]}>
          <Grid
            item
            xs={12}
            container
            justify={
              (signedInUser ? signedInUser["_id"] : null) === message.sender
                ? "flex-end"
                : "flex-start"
            }
          >
            <Chip label={message.text} className="message" />
          </Grid>
        </Grid>
      );
    });
  }

  const updateMessageToSend = (event) => {
    setMessageToSend(event.target.value);
  };

  const handleSendClick = () => {
    sendMessage(messageToSend);
    setMessageToSend("");
  };

  const sendOnEnter = (e) => {
    if (e.keyCode === 13) {
      handleSendClick();
    }
  };

  return (
    <Grid item container xs={9} className="fullHeight">
      <Grid
        item
        container
        xs={9}
        className="fullHeight messageListWrapper"
        direction="column"
        justify="space-evenly"
      >
        {currentConversation && currentConversation.messages && messageList ? (
          <>
            <Grid
              item
              xs={9}
              container
              direction="column-reverse"
              alignItems="stretch"
              className="fullWidth messageList"
              spacing={2}
            >
              {messageList.reverse()}
            </Grid>
            <Grid
              item
              container
              xs={2}
              justify="space-evenly"
              alignContent="center"
              className="fullWidth sendContainer"
            >
              <Grid item xs={9}>
                <TextField
                  value={messageToSend}
                  onChange={updateMessageToSend}
                  mr={2}
                  fullWidth
                  onKeyDown={(event) => sendOnEnter(event)}
                />
              </Grid>
              <Grid
                item
                xs={2}
                container
                alignContent="center"
                justify="center"
              >
                <Button
                  variant="contained"
                  onClick={handleSendClick}
                  color="primary"
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Grid>
      <Grid item xs={3}>
        <Box mt={10} pl={5}>
          <Typography variant="h5">
            {currentConversation && currentConversation.messages
              ? "Current conversation:"
              : null}
          </Typography>
          <Typography variant="h3">
            {currentConversation && currentConversation.messages
              ? currentConversation.name
              : null}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MainSection;
