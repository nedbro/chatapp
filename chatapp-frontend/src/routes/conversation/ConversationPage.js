import React, { useState, useEffect } from "react";
import axios from "axios";
import { SERVER_URL } from "../../utils/Constants";
import { Grid } from "@material-ui/core";
import ConversationSidebar from "./ConversationSidebar";
import ConversationMessages from "./ConversationMessages";

const ConversationPage = () => {
  const [currentConversation, setCurrentConversation] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [conversations, setConversations] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);

  useEffect(() => {
    axios.get(SERVER_URL + "/conversations").then((result) => {
      const conversationData = result.data;

      setConversations(result.data);
      setCurrentConversation(conversationData[0]["_id"]);
      setCurrentMessages(conversationData[0].messages);
      setCurrentUser(conversationData[0].participants[0]["_id"]);
    });
  }, []);

  const getConversation = (conversationId) => {
    axios
      .get(SERVER_URL + "/conversations/" + conversationId)
      .then((result) => {
        return result.data;
      });
  };

  return (
    <Grid item container>
      <ConversationSidebar conversations={conversations} />
      <ConversationMessages messages={currentMessages} />
    </Grid>
  );
};

export default ConversationPage;
