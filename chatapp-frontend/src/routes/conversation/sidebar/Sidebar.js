import { Button, Grid, Paper, Typography } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { default as Axios, default as axios } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../utils/AuthProvider";
import { SERVER_URL } from "../../../utils/Constants";
import "../conversation.css";
import ConversationList from "./ConversationList";
import ConversationStart from "./ConversationStart";
import "./sidebar.css";

const Sidebar = ({ socket }) => {
  const [conversations, setConversations] = useState([]);
  const [conversationsVisible, setConversationsVisible] = useState(true);
  const { signedInUser, setSignedInUser } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    if (socket) {
      socket.emit("subscribeToConversations", signedInUser["_id"]);

      socket.on("subscribedToConversations", () => {
        socket.emit("askForLatestConversations", signedInUser["_id"]);
      });

      socket.on("sentCurrentUsersConversations", (data) => {
        setConversations(data);
      });

      socket.on("thereIsANewMessage", () => {
        socket.emit("askForLatestConversations", signedInUser["_id"]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [socket, signedInUser, setConversations]);

  const startConversation = (user) => {
    const conversationData = {
      users: [signedInUser["_id"], user["_id"]],
      name: user.username,
    };

    axios
      .post(SERVER_URL + "/conversations", conversationData, {
        withCredentials: true,
      })
      .then((response) => {
        socket.emit("subscribeToConversations", signedInUser["_id"]);
        selectConversation(response.data["_id"]);
        setConversationsVisible(true);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setSignedInUser(null);
        }
      });
  };

  const handleConversationsTabClick = () => {
    setConversationsVisible(true);
  };

  const handleNewPeopleTabClick = () => {
    setConversationsVisible(false);
  };

  const selectConversation = (conversation) => {
    history.push(`/conversation/${conversation["_id"]}`);
  };

  const logout = () => {
    Axios.delete(SERVER_URL + "/auth/logout", {
      withCredentials: true,
    }).finally(() => setSignedInUser(null));
  };

  return (
    <Grid item container direction="column" xs={3}>
      <Paper square className="sidebarTabContainer">
        <div className="topContainer">
          <Typography variant="h5" className="username">
            {signedInUser.username}
          </Typography>
          <Button variant="contained" color="secondary" onClick={logout}>
            Logout
          </Button>
        </div>
        <Tabs
          value={conversationsVisible}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab
            label="Conversations"
            value={true}
            onClick={handleConversationsTabClick}
          />
          <Tab
            label="New People"
            value={false}
            onClick={handleNewPeopleTabClick}
          />
        </Tabs>
      </Paper>
      {conversationsVisible ? (
        <ConversationList
          conversations={conversations}
          selectConversation={selectConversation}
        />
      ) : (
        <ConversationStart startConversation={startConversation} />
      )}
    </Grid>
  );
};

export default Sidebar;
