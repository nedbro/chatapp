import { Box, Paper, Typography } from "@material-ui/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import "./sidebar.css";
import { useConversationPagination } from "./useConversationPagination";

const ConversationList = ({ selectConversation, askForMultiplePages, setAskForMultiplePages }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { conversations, isLoading, hasMore } = useConversationPagination(
    currentPage,
    askForMultiplePages,
    setAskForMultiplePages
  );

  const observer = useRef();
  const lastConversationElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((previousPage) => previousPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const createConversationCard = (conversation, index) => {
    return index < conversations.length - 1 ? (
      <Box
        display="flex"
        className="conversationBoxContainer"
        key={conversation._id}
        justify="center"
        alignItems="center"
      >
        <Paper
          className={`sidebarPaper ${
            conversation.selected ? "selectedConversationPaper" : ""
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
    ) : (
      <Box
        display="flex"
        className="conversationBoxContainer"
        key={conversation._id}
        justify="center"
        alignItems="center"
        ref={lastConversationElementRef}
      >
        <Paper
          className={`sidebarPaper ${
            conversation.selected ? "selectedConversationPaper" : ""
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
  };

  return (
    <div className="conversationContainer">
      {conversations.map((conversation, index) =>
        createConversationCard(conversation, index)
      )}
    </div>
  );
};

export default ConversationList;
