import React, { useState } from "react";
import { Button, Grid } from "@material-ui/core";
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import "./conversation.css";

const ConversationMessages = ({ messages, sendMessage, currentUser }) => {
  const [messageToSend, setMessageToSend] = useState("");
  const messageList = messages.map((message) => {
    console.log("message", message);
    console.log("current user", currentUser);
    return (
      <Grid
        item
        container
        className="fullWidth"
        key={message["_id"]}
      >
        <Grid item xs={12} container justify={currentUser["_id"] === message.sender ? "flex-end" : "flex-start"}>
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
    <Grid item container xs={10} justify="center" alignItems="center" className="fullHeight">
      <Grid
        item
        container
        xs={6}
        className="fullHeight"
        direction="column"
      >
        <Grid
          item
          xs={10}
          container
          direction="column"
          justify="flex-end"
          alignItems="stretch"
          spacing={2}
          className="fullWidth"
        >
          {messageList}
        </Grid>
        <Grid item>
          <Input value={messageToSend} onChange={updateMessageToSend} />
          <Button variant="contained" onClick={handleSendClick}>Send</Button>
        </Grid>
      </Grid>

    </Grid>
  );
};

export default ConversationMessages;
