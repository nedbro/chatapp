import { Box, Paper, Typography } from "@material-ui/core";
import Axios from "axios";
import React, {
  useContext,
  useEffect,

  useState
} from "react";
import { AuthContext } from "../../../utils/AuthProvider";
import { SERVER_URL } from "../../../utils/Constants";
import "./sidebar.css";

const ConversationStart = ({ startConversation }) => {
  const [newUsers, setNewUsers] = useState([]);
  const { signedInUser, setSignedInUser } = useContext(AuthContext);

  useEffect(() => {
    let cancel;
    Axios.get(
      SERVER_URL + "/users/" + signedInUser["_id"] + "/newConversations",
      {
        withCredentials: true,
        cancelToken: new Axios.CancelToken((c) => (cancel = c)),
      }
    )
      .then((response) => {
        setNewUsers(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setSignedInUser(null);
        }
        if (Axios.isCancel(error)) {
          return;
        }
      });

    return () => cancel();
  }, [setSignedInUser, signedInUser]);

  const createNewConversationCard = (user, index) => {
    return (
      <Box
        display="flex"
        className="conversationBoxContainer"
        key={user["_id"]}
        justify="center"
        alignItems="center"
      >
        <Paper className="sidebarPaper" onClick={() => startConversation(user)}>
          <Typography variant="h6" gutterBottom>
            {user.username}
          </Typography>
        </Paper>
      </Box>
    );
  };

  return (
    <>{newUsers.map((user, index) => createNewConversationCard(user, index))}</>
  );
};

export default ConversationStart;
