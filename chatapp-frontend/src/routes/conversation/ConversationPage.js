import { Grid } from "@material-ui/core";
import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { SERVER_URL } from "../../utils/Constants";
import UserContext from "../../utils/UserContext";
import ConversationMessages from "./ConversationMessages";
import ConversationSidebar from "./sidebar/ConversationSidebar";

const ConversationPage = () => {
  const { currentUser, logoutUser } = useContext(UserContext);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messagesVisible, setMessagesVisible] = useState(true);
  const history = useHistory();
  const [socket, setSocket] = useState(null);

  const currentConversationRef = useRef();
  currentConversationRef.current = currentConversation;

  useEffect(() => {
    if (currentUser === null) {
      history.push("/login");
    } else if (currentUser && currentUser["_id"]) {
      const isLoggedIn = checkLoginStatus();

      if (isLoggedIn) {
        setSocket(socketIOClient(SERVER_URL + "/"));
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (socket) {
      socket.emit("subscribeToConversations", currentUser["_id"]);

      socket.on("sentCurrentUsersConversations", (data) => {
        updateConversations(data);
      });

      socket.on("thereIsANewMessage", () => {
        socket.emit("askForLatestConversations", currentUser["_id"]);
      });

      return () => socket.disconnect();
    }
  }, [socket]);

  const updateConversations = (data) => {
    setConversations(data);
    console.log("current", currentConversationRef.current);
    if (!currentConversationRef.current) {
      setCurrentConversation(data[0]);
    } else {
      data.forEach((element) => {
        if (element["_id"] === currentConversationRef.current["_id"]) {
          setCurrentConversation(element);
        }
      });
    }
  };

  const sendMessage = async (message) => {
    if (socket) {
      const messageToSend = {
        sender: currentUser["_id"],
        messageText: message,
      };
      // try {
      //   await axios.post(
      //     SERVER_URL + "/conversations/" + currentConversation["_id"],
      //     messageToSend,
      //     { withCredentials: true }
      //   );
      //   const conversationResponse = await getConversation(
      //     currentConversation["_id"]
      //   );
      //   const updatedCurrentConversation = conversationResponse.data;
      //   setCurrentConversation(updatedCurrentConversation);
      // } catch (error) {
      //   if (error.response && error.response.status === 401) {
      //     logoutUser();
      //   }
      // }

      socket.emit("sendMessage", currentConversation["_id"], messageToSend);
    } else {
      console.log("socket", socket);
    }
  };

  const selectConversation = (conversation) => {
    setCurrentConversation(conversation);
    setMessagesVisible(true);
  };

  const checkLoginStatus = async () => {
    try {
      await axios.get(SERVER_URL + "/auth/loginstatus", {
        withCredentials: true,
      });
      return true;
    } catch (error) {
      logoutUser();
      return false;
    }
  };

  return (
    <Grid item container>
      <ConversationSidebar
        conversations={conversations}
        selectConversation={selectConversation}
        setMessagesVisible={setMessagesVisible}
        currentConversation={currentConversation || { messages: [] }}
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
