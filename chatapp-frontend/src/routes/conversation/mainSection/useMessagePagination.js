import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "../../../utils/Constants";
import "../conversation.css";

export const useMessagePagination = (pageNumber) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { conversationId } = useParams();

  useEffect(() => {
    setMessages([]);
    setHasMore(true);
  }, [conversationId]);

  useEffect(() => {
    let cancel;
    setIsLoading(true);
    Axios.get(`${SERVER_URL}/messages/ofConversation/${conversationId}`, {
      params: { page: pageNumber },
      withCredentials: true,
      cancelToken: new Axios.CancelToken((c) => (cancel = c)),
    })
      .then((response) => {
        setMessages((currentMessages) => {
          const newArray = [...currentMessages, ...response.data.messages];
          const finalArray = removeDuplicates(newArray);
          return finalArray;
        });

        setIsLoading(false);
        if (pageNumber === response.data.totalPages) {
          setHasMore(false);
        }
      })
      .catch((error) => {
        if (Axios.isCancel(error)) {
          return;
        }
      });

    return () => cancel();
  }, [pageNumber, conversationId]);

  const removeDuplicates = (array) => {
    const helperSet = new Set();
    const finalArray = array.filter((message) => {
      const duplicate = helperSet.has(message["_id"]);
      helperSet.add(message["_id"]);
      return !duplicate;
    });
    return finalArray;
  };

  const addMessageToTheStart = (message) => {
    setMessages((currentMessages) => {
      return removeDuplicates([message, ...currentMessages]);
    });
  };

  return { messages, addMessageToTheStart, isLoading, hasMore };
};
