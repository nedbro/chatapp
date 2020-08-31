import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../utils/Constants";
import { Grid } from "@material-ui/core";
import ConversationSidebar from "./ConversationSidebar";
import ConversationMessages from "./ConversationMessages";
import { useHistory } from "react-router-dom";

const ConversationPage = () => {
  const [currentConversation, setCurrentConversation] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [conversations, setConversations] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const history = useHistory();
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (user === null) {
      history.push("/login");
    }
  }, []);


  useEffect(() => {
    axios.get(SERVER_URL + "/conversations").then((result) => {
      const conversationData = result.data;

      setConversations(result.data);
      setCurrentConversation(conversationData[0]);
      setCurrentMessages(conversationData[0].messages);
      setCurrentUser(conversationData[0].participants[0]);
    });
  }, []);

  const getConversation = (conversationId) => {
    return axios
      .get(SERVER_URL + "/conversations/" + conversationId);
  };

  const sendMessage = (message) => {
    const messageToSend = {
      sender: currentUser["_id"],
      messageText: message
    };

    axios.post(SERVER_URL + "/conversations/" + currentConversation["_id"], messageToSend).then(() => {
      getConversation(currentConversation["_id"]).then((result) => {
        const conversationData = result.data;
        setCurrentConversation(conversationData);
        setCurrentMessages(conversationData.messages);
      });
    });
  };

  const selectConversation = (conversation) => {
    setCurrentConversation(conversation);
    setCurrentMessages(conversation.messages);
  };

  return (
    <Grid item container>
      <ConversationSidebar
        conversations={conversations}
        selectConversation={selectConversation}
      />
      <ConversationMessages
        messages={currentMessages}
        sendMessage={sendMessage}
        currentUser={currentUser}
      />
    </Grid>
  );
};

export default ConversationPage;
