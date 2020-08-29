import React from "react";
import { Grid } from "@material-ui/core";

const ConversationSidebar = ({ conversations }) => {
  const conversationList = conversations.map((conversation) => {
    return <div>{conversation.name + ": " + conversation["_id"]}</div>;
  });

  return (
    <Grid item container direction="columnt" xs={4}>
      {conversationList}
    </Grid>
  );
};

export default ConversationSidebar;
