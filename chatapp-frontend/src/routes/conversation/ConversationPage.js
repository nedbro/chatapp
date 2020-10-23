import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { AuthContext } from "../../utils/AuthProvider";
import { SERVER_URL } from "../../utils/Constants";
import ConversationMessages from "./ConversationMessages";
import ConversationSidebar from "./sidebar/ConversationSidebar";

const ConversationPage = () => {
  const { signedInUser } = useContext(AuthContext);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messagesVisible, setMessagesVisible] = useState(true);
  const [socket, setSocket] = useState(null);

  const currentConversationRef = useRef();
  currentConversationRef.current = currentConversation;

  useEffect(() => {
    if (signedInUser && signedInUser["_id"]) {
      setSocket(socketIOClient(SERVER_URL + "/"));
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("subscribeToConversations", signedInUser["_id"]);

      const interval = setInterval(() => {
        socket.emit("subscribeToConversations", signedInUser["_id"]);
      }, 10000);

      socket.on("subscribedToConversations", () => {
        socket.emit("askForLatestConversations", signedInUser["_id"]);
      });

      socket.on("sentCurrentUsersConversations", (data) => {
        updateConversations(data);
      });

      socket.on("thereIsANewMessage", () => {
        socket.emit("askForLatestConversations", signedInUser["_id"]);
      });

      return () => {
        clearInterval(interval);
        socket.disconnect();
      };
    }
  }, [socket]);

  const updateConversations = (data) => {
    setConversations(data);
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
        sender: signedInUser["_id"],
        messageText: message,
      };
      socket.emit("sendMessage", currentConversation["_id"], messageToSend);
    } else {
      console.log("socket", socket);
    }
  };

  const selectConversation = (conversation) => {
    conversations.forEach((element) => {
      if (conversation["_id"] === element["_id"]) {
        setCurrentConversation(element);
      }
    });
    setMessagesVisible(true);
  };

  return (
    <Grid item container>
      <ConversationSidebar
        conversations={conversations}
        selectConversation={selectConversation}
        setMessagesVisible={setMessagesVisible}
        currentConversation={currentConversation || { messages: [] }}
        socket={socket}
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
