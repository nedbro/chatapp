import { Button, Grid, TextField } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../utils/AuthProvider";
import { SERVER_URL } from "../../utils/Constants";
import "./conversation.css";

const MainSection = ({ currentConversation, sendMessage }) => {
  const { signedInUser } = useContext(AuthContext);
  const [messageToSend, setMessageToSend] = useState("");
  const messageList = currentConversation.messages.map((message) => {
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

  const updateMessageToSend = (event) => {
    setMessageToSend(event.target.value);
  };

  const handleSendClick = () => {
    sendMessage(messageToSend);
    setMessageToSend("");
  };

  const keyPress = (e) => {
    if (e.keyCode == 13) {
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
        {currentConversation && messageList ? (
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
                  onKeyDown={(event) => keyPress(event)}
                />
              </Grid>
              <Grid
                item
                xs={2}
                container
                alignContent="center"
                justify="center"
              >
                <Button variant="contained" onClick={handleSendClick}>
                  Send
                </Button>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default MainSection;
