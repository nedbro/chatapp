import { Grid, Paper } from "@material-ui/core";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import axios from "axios";
import React, { useContext, useState } from "react";
import { SERVER_URL } from "../../../utils/Constants";
import UserContext from "../../../utils/UserContext";
import "../conversation.css";
import ConversationList from "./ConversationList";
import ConversationStart from "./ConversationStart";

const ConversationSidebar = ({
  conversations,
  selectConversation,
  setMessagesVisible,
  currentConversation
}) => {
  const [conversationsVisible, setConversationsVisible] = useState(true);
  const { currentUser, logoutUser } = useContext(UserContext);

  const startConversation = (user) => {
    const conversationData = {
      users: [currentUser["_id"], user["_id"]],
      name: currentUser.username + " - " + user.username,
    };

    axios
      .post(SERVER_URL + "/conversations", conversationData, {
        withCredentials: true,
      })
      .then((response) => {
        setConversationsVisible(true);
        selectConversation(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          logoutUser();
        }
      });
  };

  const handleConversationsTabClick = () => {
    selectConversation(conversations[0]);
    setMessagesVisible(true);
    setConversationsVisible(true);
  };

  const handleNewPeopleTabClick = () => {
    setMessagesVisible(false);
    setConversationsVisible(false);
  };

  return (
    <Grid item container direction="column" xs={2}>
      <Paper square>
        <Tabs
          value={conversationsVisible}
          indicatorColor="primary"
          textColor="primary"
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

export default ConversationSidebar;
