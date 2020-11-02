import { Button, Grid, Paper, Typography } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import Axios from "axios";
import axios from "axios";
import React, { useContext, useState } from "react";
import { AuthContext } from "../../../utils/AuthProvider";
import { SERVER_URL } from "../../../utils/Constants";
import "../conversation.css";
import ConversationList from "./ConversationList";
import ConversationStart from "./ConversationStart";

const Sidebar = ({
  conversations,
  selectConversation,
  currentConversation,
  socket,
}) => {
  const [conversationsVisible, setConversationsVisible] = useState(true);
  const { signedInUser, setSignedInUser } = useContext(AuthContext);

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
        selectConversation(response.data);
        setConversationsVisible(true);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setSignedInUser(null);
        }
      });
  };

  const handleConversationsTabClick = () => {
    selectConversation(conversations[0]);
    setConversationsVisible(true);
  };

  const handleNewPeopleTabClick = () => {
    setConversationsVisible(false);
  };

  const logout = () => {
    Axios.delete(SERVER_URL + "/auth/logout", {
      withCredentials: true,
    }).finally(() => setSignedInUser(null));
  };

  return (
    <Grid item container direction="column" xs={3}>
      <Paper square>
        <Typography>{signedInUser.username}</Typography>
        <Button onClick={logout}>Logout</Button>
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
          currentConversation={currentConversation}
        />
      ) : (
        <ConversationStart startConversation={startConversation} />
      )}
    </Grid>
  );
};

export default Sidebar;
