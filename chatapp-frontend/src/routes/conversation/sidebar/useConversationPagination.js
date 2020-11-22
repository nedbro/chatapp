import React, { useEffect, useState } from "react";
import Axios from "axios";
import { SERVER_URL } from "../../../utils/Constants";

export const useConversationPagination = (
  pageNumber,
  askForMultiplePages,
  setAskForMultiplePages
) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let cancel;
    setIsLoading(true);
    Axios.get(`${SERVER_URL}/conversations`, {
      params: { page: pageNumber },
      withCredentials: true,
      cancelToken: new Axios.CancelToken((c) => (cancel = c)),
    })
      .then((response) => {
        console.log("response", response);
        setConversations((currentConversations) => {
          console.log("response.data", response.data);
          const newArray = [
            ...currentConversations,
            ...response.data.conversations,
          ];
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
  }, [pageNumber]);

  useEffect(() => {
    console.log("asked for multiple pages");
    if (askForMultiplePages) {
      let cancel;
      setIsLoading(true);
      Axios.get(`${SERVER_URL}/conversations`, {
        params: { page: pageNumber, limit: pageNumber * 6 },
        withCredentials: true,
        cancelToken: new Axios.CancelToken((c) => (cancel = c)),
      })
        .then((response) => {
          console.log("response", response);
          setConversations((currentConversations) => {
            console.log("response.data", response.data);
            const newArray = [
              ...currentConversations,
              ...response.data.conversations,
            ];
            const finalArray = removeDuplicates(newArray);
            return finalArray;
          });

          setIsLoading(false);
          if (pageNumber === response.data.totalPages) {
            setHasMore(false);
          }
          setAskForMultiplePages(false);
        })
        .catch((error) => {
          if (Axios.isCancel(error)) {
            return;
          }
        });

      return () => cancel();
    }
  }, [pageNumber, askForMultiplePages, setAskForMultiplePages]);

  const removeDuplicates = (array) => {
    const helperSet = new Set();
    const finalArray = array.filter((conversation) => {
      const duplicate = helperSet.has(conversation["_id"]);
      helperSet.add(conversation["_id"]);
      return !duplicate;
    });
    return finalArray;
  };

  return { conversations, isLoading, hasMore };
};
