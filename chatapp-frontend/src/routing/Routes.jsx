import React, { useContext, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import LoginPage from "../routes/auth/LoginPage";
import UserRegistration from "../routes/auth/UserRegistration";
import { EmptyConversation } from "../routes/conversation/mainSection/EmptyConversation";
import Sidebar from "../routes/conversation/sidebar/Sidebar";
import { AuthContext } from "../utils/AuthProvider";
import { SERVER_URL } from "../utils/Constants";
import socketIOClient from "socket.io-client";
import MainSection from "../routes/conversation/mainSection/MainSection";

export const Routes = () => {
  const { signedInUser } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(socketIOClient(SERVER_URL + "/"));
  }, []);

  return signedInUser ? (
    <>
      <Sidebar socket={socket} />
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
