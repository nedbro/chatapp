import { Grid } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { SERVER_URL } from "../../utils/Constants";
import UserContext from "../../utils/UserContext";
import ConversationMessages from "./ConversationMessages";
import ConversationSidebar from "./sidebar/ConversationSidebar";

const ConversationPage = () => {
  const { currentUser, logoutUser } = useContext(UserContext);
  const [currentConversation, setCurrentConversation] = useState("");
  const [conversations, setConversations] = useState([]);
  const [messagesVisible, setMessagesVisible] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (currentUser === null) {
      history.push("/login");
    } else if (currentUser && currentUser["_id"]) {
      getAllConversations()
        .then((result) => {
          const returnedConversations = result.data;

          if (returnedConversations && returnedConversations.length > 0) {
            setConversations(result.data);
            setCurrentConversation(returnedConversations[0]);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            logoutUser();
          }
        });
    }
  }, [currentUser]);

  const getConversation = (conversationId) => {
    return axios.get(SERVER_URL + "/conversations/" + conversationId, {
      withCredentials: true,
    });
  };

  const getAllConversations = () => {
    return axios.get(
      SERVER_URL + "/users/" + currentUser["_id"] + "/conversations",
      { withCredentials: true }
    );
  };

  const sendMessage = async (message) => {
    const messageToSend = {
      sender: currentUser["_id"],
      messageText: message,
    };
    try {
      await axios.post(
        SERVER_URL + "/conversations/" + currentConversation["_id"],
        messageToSend,
        { withCredentials: true }
      );
      const conversationResponse = await getConversation(
        currentConversation["_id"]
      );
      const updatedCurrentConversation = conversationResponse.data;
      setCurrentConversation(updatedCurrentConversation);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
    }
  };

  const selectConversation = async (conversation) => {
    try {
      const response = await getAllConversations();
      const allConversations = response.data;
      console.log(allConversations);
      if (allConversations && allConversations.length > 0) {
        setConversations(allConversations);
        const conversationToSelect = allConversations.find(
          (element) => element["_id"] === conversation["_id"]
        );
        setCurrentConversation(conversationToSelect);
        setMessagesVisible(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logoutUser();
      }
    }
  };

  return (
    <Grid item container>
      <ConversationSidebar
        conversations={conversations}
        selectConversation={selectConversation}
        setMessagesVisible={setMessagesVisible}
        currentConversation={currentConversation}
      />
      <ConversationMessages
        currentConversation={currentConversation || { messages: [] }}
        sendMessage={sendMessage}
        conversationSelected={!!currentConversation}
        messagesVisible={messagesVisible}
      />
    </Grid>
  );
};

export default ConversationPage;
