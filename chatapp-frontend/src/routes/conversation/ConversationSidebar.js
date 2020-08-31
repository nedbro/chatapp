import React from "react";
import { Grid, Paper, Typography } from "@material-ui/core";
import "./conversation.css";

const ConversationSidebar = ({ conversations, selectConversation }) => {
  const conversationList = conversations.map((conversation) => {
    return (
      <Grid
        item
        container
        direction="row"
        xs={2}
        className="fullWidth"
        key={conversation._id}
        justify="center"
        alignItems="center"
      >
        <Paper className="conversationPaper" onClick={() => selectConversation(conversation)}>
          <Typography variant="h6" gutterBottom>
            {conversation.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {conversation.messages.slice(-1)[0] ? conversation.messages.slice(-1)[0].text : ""}
          </Typography>
        </Paper>
      </Grid>
    );
  });

  return (
    <Grid item container direction="column" xs={2}>
      {conversationList}
    </Grid>
  );
};

export default ConversationSidebar;
