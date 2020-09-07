import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../utils/Constants";
import { Grid } from "@material-ui/core";
import ConversationSidebar from "./sidebar/ConversationSidebar";
import ConversationMessages from "./ConversationMessages";
import { useHistory } from "react-router-dom";
import socketIOClient from "socket.io-client";

const ConversationPage = () => {
  const [currentConversation, setCurrentConversation] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [conversations, setConversations] = useState([]);
  const [messagesVisible, setMessagesVisible] = useState(true);
  const history = useHistory();
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (user === null) {
      history.push("/login");
    } else {
      setCurrentUser(JSON.parse(user));
      const socket = socketIOClient(SERVER_URL + "/");
      socket.send("subscribeToConversations", JSON.parse(user)["_id"]);
      return () => socket.disconnect();
    }
  }, []);

  useEffect(() => {
    if (currentUser["_id"]) {
      getAllConversations().then((result) => {
        const returnedConversations = result.data;

        if (returnedConversations && returnedConversations.length > 0) {
          setConversations(result.data);
          setCurrentConversation(returnedConversations[0]);
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

  const sendMessage = async (message) => {
    const messageToSend = {
      sender: currentUser["_id"],
      messageText: message
    };
    try {
      await axios.post(SERVER_URL + "/conversations/" + currentConversation["_id"], messageToSend, { withCredentials: true });
      const conversationResponse = await getConversation(currentConversation["_id"]);
      const updatedCurrentConversation = conversationResponse.data;
      setCurrentConversation(updatedCurrentConversation);

    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user");
        history.push("/login");
      }
    }
  };

  const selectConversation = async (conversation) => {
    try {
      const response = await getAllConversations();
      const allConversations = response.data;
      if (allConversations && allConversations.length > 0) {
        setConversations(allConversations);
        const conversationToSelect = allConversations.find(element => element["_id"] === conversation["_id"]);
        setCurrentConversation(conversationToSelect);
        setMessagesVisible(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("user");
        history.push("/login");
      }
    }
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
        currentConversation={currentConversation || { messages: [] }}
        sendMessage={sendMessage}
        currentUser={currentUser}
        conversationSelected={!!currentConversation}
        messagesVisible={messagesVisible}
      />
    </Grid>
  );
};

export default ConversationPage;
