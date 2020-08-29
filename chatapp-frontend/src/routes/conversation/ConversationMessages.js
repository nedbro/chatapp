import React from "react";
import { Grid, Box } from "@material-ui/core";

const ConversationMessages = ({ messages }) => {
  const messageList = messages.map((message) => {
    return (
      <Grid item className="fullWidth" key={message._id}>
        <Box className="fullWidth">{message.text}</Box>
      </Grid>
    );
  });

  return (
    <Grid
      item
      xs={8}
      container
      direction="column"
      justify="flex-start"
      alignItems="stretch"
    >
      {messageList}
    </Grid>
  );
};

export default ConversationMessages;
