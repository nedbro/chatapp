import { Button, Chip, Grid, TextField } from "@material-ui/core";
import React, { useCallback, useContext, useRef, useState } from "react";
import { AuthContext } from "../../../utils/AuthProvider";
import "../conversation.css";

export const MessageSection = ({
  messages = [],
  emitToSocketOnMessageSend,
  isLoading,
  hasMore,
  setCurrentPage,
}) => {
  const { signedInUser } = useContext(AuthContext);
  const [messageToSend, setMessageToSend] = useState("");

  const observer = useRef();
  const lastMessageElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setCurrentPage((previousPage) => previousPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, setCurrentPage]
  );

  const updateMessageToSend = (event) => {
    setMessageToSend(event.target.value);
  };

  const handleSend = () => {
    const dataToSend = {
      sender: signedInUser["_id"],
      messageText: messageToSend,
    };
    emitToSocketOnMessageSend(dataToSend);
    setMessageToSend("");
  };

  const sendOnEnter = (e) => {
    if (e.keyCode === 13) {
      handleSend();
    }
  };

  const createMessageElement = (message, index) => {
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
          {messages.length === index + 1 ? (
            <Chip
              label={message.text}
              ref={lastMessageElementRef}
              className="message"
            />
          ) : (
            <Chip
              label={message.text}
              className="message"
            />
          )}
        </Grid>
      </Grid>
    );
  };

  return (
    <>
      <Grid item xs={9} container className="fullWidth messageList" spacing={2}>
        <div className="messageList ">
          {messages.map((message, index) =>
            createMessageElement(message, index)
          )}
        </div>
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
        <Grid item xs={2} container alignContent="center" justify="center">
          <Button variant="contained" onClick={handleSend} color="primary">
            Send
          </Button>
        </Grid>
      </Grid>
    </>
  );
};
