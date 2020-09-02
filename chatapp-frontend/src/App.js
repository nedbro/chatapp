import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import UserRegistartion from "./routes/registration/UserRegistration";
import ConversationPage from "./routes/conversation/ConversationPage";
import { CssBaseline, Grid, StylesProvider } from "@material-ui/core";
import LoginPage from "./routes/login/LoginPage";

function App() {

  return (
    <StylesProvider injectFirst>
      <CssBaseline />
      <div className="App fullHeight">
        <Grid container className="fullHeight">
          <Switch>
            <Route path="/registration" exact>
              <UserRegistartion />
            </Route>
            <Route path="/login" exact>
              <LoginPage />
            </Route>
            <Route path="/conversation" exact>
              <ConversationPage />
            </Route>
            <Route path="/">
              <LoginPage />
            </Route>
          </Switch>
        </Grid>
      </div>
    </StylesProvider>
  );
}

export default App;
