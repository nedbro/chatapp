import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";

export const ConversationSidebar = ({ currentConversation }) => {
  return (
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
  );
};
