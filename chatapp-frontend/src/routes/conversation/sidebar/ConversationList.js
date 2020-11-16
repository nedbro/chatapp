import { Box, Paper, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./sidebar.css";

const ConversationList = ({
  conversations,
  selectConversation,
  currentConversation,
}) => {
  const [conversationList, setConversationList] = useState([]);
  const { conversationId } = useParams();

  useEffect(() => {
    if (conversations) {
      const newConversationList = conversations.map((conversation) => {
        const selected = conversationId
          ? conversationId === conversation["_id"]
          : false;

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
      setConversationList(newConversationList);
    }
  }, [
    conversations,
    conversationId,
    selectConversation,
    setConversationList,
  ]);
  return <>{conversationList}</>;
};

export default ConversationList;
