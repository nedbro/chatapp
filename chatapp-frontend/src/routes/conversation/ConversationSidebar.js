import React from "react";
import { Grid, Paper } from "@material-ui/core";
import "./conversation.css";
import ConversationList from "./ConversationList";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

const ConversationSidebar = ({ conversations, selectConversation }) => {

  return (
    <Grid item container direction="column" xs={2}>
      <Paper square>
        <Tabs
          value={{}}
          indicatorColor="primary"
          textColor="primary"
          aria-label="disabled tabs example"
        >
          <Tab label="Conversations">ASD</Tab>
          <Tab label="New People" />
        </Tabs>
      </Paper>
      <ConversationList conversations={conversations} selectConversation={selectConversation} />
    </Grid>
  );
};

export default ConversationSidebar;
