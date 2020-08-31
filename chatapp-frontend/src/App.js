import React from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import UserRegistartion from "./routes/registration/UserRegistration";
import ConversationPage from "./routes/conversation/ConversationPage";
import { CssBaseline, Grid, StylesProvider } from "@material-ui/core";

function App() {
  return (
    <StylesProvider injectFirst>
      <CssBaseline />
      <div className="App fullHeight">
        <Grid container className="fullHeight">
          <Switch>
            <Route path="/registration">
              <UserRegistartion />
            </Route>
            <Route path="/conversation">
              <ConversationPage />
            </Route>
          </Switch>
        </Grid>
      </div>
    </StylesProvider>
  );
}

export default App;
