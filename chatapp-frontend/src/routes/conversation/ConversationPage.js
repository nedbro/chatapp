import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../utils/Constants";
import { Grid } from "@material-ui/core";
import ConversationSidebar from "./sidebar/ConversationSidebar";
import ConversationMessages from "./ConversationMessages";
import { useHistory } from "react-router-dom";

const ConversationPage = () => {
  const [currentConversation, setCurrentConversation] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [conversations, setConversations] = useState([]);
  const [currentMessages, setCurrentMessages] = useState([]);
  const [messagesVisible, setMessagesVisible] = useState(true);
  const history = useHistory();
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (user === null) {
      history.push("/login");
    } else {
      setCurrentUser(JSON.parse(user));
    }
  }, []);


  useEffect(() => {
    if (currentUser["_id"]) {
      getAllConversations().then((result) => {
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
    }
  }, [currentUser]);

  const getConversation = (conversationId) => {
    return axios
      .get(SERVER_URL + "/conversations/" + conversationId, { withCredentials: true });
  };

  const getAllConversations = () => {
    return axios.get(SERVER_URL + "/users/" + currentUser["_id"] + "/conversations", { withCredentials: true });
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
            setCurrentMessages(conversationData.messages || []);
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
    getAllConversations().then((result) => {
      const conversationData = result.data;

      if (conversationData && conversationData.length > 0) {
        setConversations(result.data);
        result.data.forEach((returnedConversation) => {
          if (returnedConversation["_id"] === conversation["_id"]) {
            setCurrentConversation(returnedConversation);
            setCurrentMessages(returnedConversation.messages);
            setMessagesVisible(true);
          }
        });
      }
    }).catch((error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user");
        history.push("/login");
      }
    });
  };

  return (
    <Grid item container>
      <ConversationSidebar
        conversations={conversations}
        selectConversation={selectConversation}
        currentUser={currentUser}
        setMessagesVisible={setMessagesVisible}
      />
      <ConversationMessages
        messages={currentMessages}
        sendMessage={sendMessage}
        currentUser={currentUser}
        conversationSelected={!!currentConversation}
        messagesVisible={messagesVisible}
      />
    </Grid>
  );
};

export default ConversationPage;
