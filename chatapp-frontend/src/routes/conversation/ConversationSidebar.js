import React from "react";
import { Grid, Box, Paper } from "@material-ui/core";

const ConversationSidebar = ({ conversations }) => {
  const conversationList = conversations.map((conversation) => {
    return (
      <Grid item xs={4} className="fullWidth" key={conversation._id}>
        <Box className="fullWidth">
          {conversation.name + ": " + conversation["_id"]}
        </Box>
      </Grid>
    );
  });

  return (
    <Grid item container direction="column" xs={4}>
      {conversationList}
    </Grid>
  );
};

export default ConversationSidebar;
