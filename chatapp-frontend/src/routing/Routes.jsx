import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ConversationPage from "../routes/conversation/ConversationPage";
import { useContext } from "react";
import { AuthContext } from "../utils/AuthProvider";
import LoginPage from "../routes/auth/LoginPage";
import UserRegistration from "../routes/auth/UserRegistration";

export const Routes = () => {
  const { signedInUser } = useContext(AuthContext);

  console.log("signed in user");
  return signedInUser ? (
    <Switch>
      <Route path="/conversation" exact>
        <ConversationPage />
      </Route>
      <Redirect to="/conversation" />
    </Switch>
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
