import React from "react";
import { Switch, Route, Link } from "react-router-dom";
import "./App.css";
import UserRegistartion from "./routes/registration/UserRegistration";
import ConversationPage from "./routes/conversation/ConversationPage";
import { Grid, StylesProvider, CssBaseline } from "@material-ui/core";

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
