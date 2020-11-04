import { Box, Paper, Typography } from "@material-ui/core";
import React from "react";
import "./sidebar.css";

const ConversationList = ({
  conversations,
  selectConversation,
  currentConversation,
}) => {
  const conversationList = conversations.map((conversation) => {
    const selected = currentConversation["_id"] === conversation["_id"];

    return (
      <Box
        display="flex"
        className="conversationBoxContainer"
        key={conversation._id}
        justify="center"
        alignItems="center"
      >
        <Paper
          className={`sidebarPaper ${
            selected ? "selectedConversationPaper" : ""
          }`}
          onClick={() => selectConversation(conversation)}
        >
          <Typography variant="h6" gutterBottom>
            {conversation.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {conversation.messages.slice(-1)[0]
              ? conversation.messages.slice(-1)[0].text
              : ""}
          </Typography>
        </Paper>
      </Box>
    );
  });

  return <>{conversationList}</>;
};

export default ConversationList;
