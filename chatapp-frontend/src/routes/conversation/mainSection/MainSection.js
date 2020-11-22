import { Grid } from "@material-ui/core";
import Axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../utils/AuthProvider";
import { SERVER_URL } from "../../../utils/Constants";
import "../conversation.css";
import { ConversationSidebar } from "./ConversationSidebar";
import { MessageSection } from "./MessageSection";
import { useMessagePagination } from "./useMessagePagination";

const MainSection = ({ socket }) => {
  const { setSignedInUser } = useContext(AuthContext);
  const { conversationId } = useParams();
  const [currentConversation, setCurrentConversation] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const {
    messages,
    addMessageToTheStart,
    isLoading,
    hasMore,
  } = useMessagePagination(currentPage);

  useEffect(() => {
    if (conversationId) {
      socket.on(`newMessageIn${conversationId}`, (message) => {
        addMessageToTheStart(message);
      });
      setCurrentPage(1);
    }
  }, [conversationId]);

  useEffect(() => {
    if (conversationId && !currentConversation) {
      let cancel;
      Axios.get(`${SERVER_URL}/conversations/${conversationId}`, {
        withCredentials: true,
        cancelToken: new Axios.CancelToken((c) => (cancel = c)),
      })
        .then((response) => {
          const conversation = response.data;
          if (conversation["_id"] === conversationId) {
            setCurrentConversation(conversation);
          }
        })
        .catch((error) => {
          if (Axios.isCancel(error)) {
            return;
          }
          if (error.response && error.response.status === 401) {
            setSignedInUser(null);
          }
        });

      return () => cancel();
    }
  }, [conversationId, currentConversation, setSignedInUser]);

  const emitToSocketOnMessageSend = (dataToSend) => {
    if (socket) {
      socket.emit("sendMessage", conversationId, dataToSend);
    } else {
      console.log("socket", socket);
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
        {conversationId ? (
          <>
            <MessageSection
              messages={messages}
              emitToSocketOnMessageSend={emitToSocketOnMessageSend}
              isLoading={isLoading}
              hasMore={hasMore}
              setCurrentPage={setCurrentPage}
            ></MessageSection>
          </>
        ) : null}
      </Grid>
      <ConversationSidebar currentConversation={currentConversation} />
    </Grid>
  );
};

export default MainSection;
