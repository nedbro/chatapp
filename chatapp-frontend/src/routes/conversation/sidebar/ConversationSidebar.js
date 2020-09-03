import React, { useState } from "react";
import { Grid, Paper } from "@material-ui/core";
import "../conversation.css";
import ConversationList from "./ConversationList";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ConversationStart from "./ConversationStart";
import axios from "axios";
import { SERVER_URL } from "../../../utils/Constants";
import { useHistory } from "react-router-dom";

const ConversationSidebar = ({ conversations, selectConversation, currentUser, setMessagesVisible }) => {
  const [conversationsVisible, setConversationsVisible] = useState(true);
  const history = useHistory();

  const startConversation = (user) => {
    const conversationData = {
      users: [currentUser["_id"], user["_id"]],
      name: currentUser.username + " - " + user.username
    };

    axios
      .post(SERVER_URL + "/conversations", conversationData, { withCredentials: true })
      .then((response) => {
        setConversationsVisible(true);
        selectConversation(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("user");
          history.push("/login");
        }
      });
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
            label="Conversations" value={true} onClick={() => {
            selectConversation(conversations[0]);
            setMessagesVisible(true);
            setConversationsVisible(true);
          }}
          />
          <Tab
            label="New People" value={false} onClick={() => {
            setMessagesVisible(false);
            setConversationsVisible(false);
          }}
          />
        </Tabs>
      </Paper>
      {conversationsVisible ?
        (
          <ConversationList conversations={conversations} selectConversation={selectConversation} />
        ) : <ConversationStart currentUser={currentUser} startConversation={startConversation} />}

    </Grid>
  );
};

export default ConversationSidebar;
