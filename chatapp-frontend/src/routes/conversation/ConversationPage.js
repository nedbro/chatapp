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
    } else {
      setCurrentUser(user);
    }
  }, []);


  useEffect(() => {
    axios.get(SERVER_URL + "/users/" + currentUser["_id"] + "/conversations", { withCredentials: true }).then((result) => {
      const conversationData = result.data;

      if (conversationData && conversationData.length > 0) {
        setConversations(result.data);
        setCurrentConversation(conversationData[0]);
        setCurrentMessages(conversationData[0].messages);
      }
    }).catch((error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user");
        history.push("/login");
      }
    });
  }, []);

  const getConversation = (conversationId) => {
    return axios
      .get(SERVER_URL + "/conversations/" + conversationId, { withCredentials: true });
  };

  const sendMessage = (message) => {
    const messageToSend = {
      sender: currentUser["_id"],
      messageText: message
    };

    axios.post(SERVER_URL + "/conversations/" + currentConversation["_id"], messageToSend, { withCredentials: true })
      .then(() => {
        getConversation(currentConversation["_id"])
          .then((result) => {
            const conversationData = result.data;
            setCurrentConversation(conversationData);
            setCurrentMessages(conversationData.messages);
          })
          .catch((error) => {
            if (error.response && error.response.status === 401) {
              localStorage.removeItem("user");
              history.push("/login");
            }
          });
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("user");
          history.push("/login");
        }
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
