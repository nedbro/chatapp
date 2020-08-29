import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";
import UserRegistartion from "./routes/registration/UserRegistration";
import ConversationPage from "./routes/conversation/ConversationPage";
import { Grid } from "@material-ui/core";

function App() {
  return (
    <Router>
      <div className="App">
        <Grid container>
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
    </Router>
  );
}

export default App;
