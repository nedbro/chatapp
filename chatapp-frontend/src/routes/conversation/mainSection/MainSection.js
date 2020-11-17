import { Box, Button, Grid, TextField, Typography } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { AuthContext } from "../../../utils/AuthProvider";
import { SERVER_URL } from "../../../utils/Constants";
import "../conversation.css";

const MainSection = ({ socket }) => {
  const { signedInUser, setSignedInUser } = useContext(AuthContext);
  const [messageToSend, setMessageToSend] = useState("");
  const { conversationId } = useParams();
  const history = useHistory();
  const [currentConversation, setCurrentConversation] = useState();
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    const createMessage = (message) => {
      return (
        <Grid item container className="fullWidth" key={message["_id"]}>
          <Grid
            item
            xs={12}
            container
            justify={
              (signedInUser ? signedInUser["_id"] : null) === message.sender
                ? "flex-end"
                : "flex-start"
            }
          >
            <Chip label={message.text} className="message" />
          </Grid>
        </Grid>
      );
    };

    if (conversationId) {
      Axios.get(`${SERVER_URL}/conversations/${conversationId}`, {
        withCredentials: true,
      })
        .then((response) => {
          const conversation = response.data;
          if (conversation["_id"] === conversationId && conversation.messages) {
            conversation.messages.reverse();
            const newMessageList = conversation.messages.map((message) =>
              createMessage(message)
            );
            setCurrentConversation(conversation);
            setMessageList(newMessageList);
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            setSignedInUser(null);
          } else {
            history.push("/conversation");
          }
        });

      if (socket) {
        socket.on(`newMessageIn${conversationId}`, (message) => {
          setMessageList((current) => {
            const newMessageList = [...current];
            newMessageList.unshift(createMessage(message));
            return newMessageList;
          });
        });
      }
    }
  }, [conversationId, socket, history]);

  const updateMessageToSend = (event) => {
    setMessageToSend(event.target.value);
  };

  const handleSendClick = () => {
    if (socket) {
      const dataToSend = {
        sender: signedInUser["_id"],
        messageText: messageToSend,
      };
      socket.emit("sendMessage", conversationId, dataToSend);
      setMessageToSend("");
    } else {
      console.log("socket", socket);
    }
  };

  const sendOnEnter = (e) => {
    if (e.keyCode === 13) {
      handleSendClick();
    }
  };

  return (
    <Grid item container xs={9} className="fullHeight">
      <Grid
        item
        container
        xs={9}
        className="fullHeight messageListWrapper"
        direction="column"
        justify="space-evenly"
      >
        {conversationId && messageList ? (
          <>
            <Grid
              item
              xs={9}
              container
              direction="column-reverse"
              alignItems="stretch"
              className="fullWidth messageList"
              spacing={2}
            >
              {messageList.length > 0 ? messageList : null}
            </Grid>
            <Grid
              item
              container
              xs={2}
              justify="space-evenly"
              alignContent="center"
              className="fullWidth sendContainer"
            >
              <Grid item xs={9}>
                <TextField
                  value={messageToSend}
                  onChange={updateMessageToSend}
                  mr={2}
                  fullWidth
                  onKeyDown={(event) => sendOnEnter(event)}
                />
              </Grid>
              <Grid
                item
                xs={2}
                container
                alignContent="center"
                justify="center"
              >
                <Button
                  variant="contained"
                  onClick={handleSendClick}
                  color="primary"
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Grid>
      <Grid item xs={3}>
        <Box mt={10} pl={5}>
          <Typography variant="h5">
            {currentConversation && currentConversation.messages
              ? "Current conversation:"
              : null}
          </Typography>
          <Typography variant="h3">
            {currentConversation && currentConversation.messages
              ? currentConversation.name
              : null}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MainSection;
