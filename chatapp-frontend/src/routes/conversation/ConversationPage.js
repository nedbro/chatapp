import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { AuthContext } from "../../utils/AuthProvider";
import { SERVER_URL } from "../../utils/Constants";
import MainSection from "./MainSection";
import Sidebar from "./sidebar/Sidebar";

const ConversationPage = () => {
  const { signedInUser } = useContext(AuthContext);
  const [currentConversation, setCurrentConversation] = useState({});
  const [conversations, setConversations] = useState([]);
  const [socket, setSocket] = useState(null);

  const currentConversationRef = useRef();
  currentConversationRef.current = currentConversation;

  useEffect(() => {
    setSocket(socketIOClient(SERVER_URL + "/"));
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit("subscribeToConversations", signedInUser["_id"]);

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
    setCurrentConversation(conversation);
  };

  return (
    <Grid item container>
      <Sidebar
        conversations={conversations}
        selectConversation={selectConversation}
        currentConversation={currentConversation}
        socket={socket}
      />
      <MainSection
        currentConversation={currentConversation}
        sendMessage={sendMessage}
      />
    </Grid>
  );
};

export default ConversationPage;
