import React, { useContext, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import LoginPage from "../routes/auth/LoginPage";
import UserRegistration from "../routes/auth/UserRegistration";
import { EmptyConversation } from "../routes/conversation/mainSection/EmptyConversation";
import Sidebar from "../routes/conversation/sidebar/Sidebar";
import { AuthContext } from "../utils/AuthProvider";
import socketIOClient from "socket.io-client";

import MainSection from "../routes/conversation/mainSection/MainSection";
import { SERVER_URL } from "../utils/Constants";

export const Routes = () => {
  const { signedInUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (signedInUser && !socket) {
      const helper = socketIOClient(SERVER_URL + "/");
      setSocket(helper);
      return () => {
        helper.disconnect();
        setSocket(null);
      };
    }
  }, [signedInUser]);

  return signedInUser ? (
    <>
      <Sidebar socket={socket} setSocket={setSocket} />
      <Switch>
        <Route path="/conversation" exact>
          <EmptyConversation />
        </Route>
        <Route path="/conversation/:conversationId" exact>
          <MainSection socket={socket} />
        </Route>
        <Redirect to="/conversation" />
      </Switch>
    </>
  ) : (
    <Switch>
      <Route path="/registration" exact>
        <UserRegistration />
      </Route>
      <Route path="/login" exact>
        <LoginPage />
      </Route>
      <Redirect to="/login" />
    </Switch>
  );
};
