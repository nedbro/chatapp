import { CssBaseline, Grid, StylesProvider } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import ConversationPage from "./routes/conversation/ConversationPage";
import LoginPage from "./routes/login/LoginPage";
import UserRegistartion from "./routes/registration/UserRegistration";
import { UserProvider } from "./utils/UserContext";

function App() {
  const history = useHistory();
  const user = localStorage.getItem("user");

  const logoutUser = () => {
    setContextValue(defaultContextValue);
    localStorage.removeItem("user");
    history.push("/login");
  };

  const defaultContextValue = {
    currentUser: null,
    logoutUser: logoutUser,
  };

  const [contextValue, setContextValue] = useState(defaultContextValue);

  useEffect(() => {
    if (user === null) {
      history.push("/login");
    } else {
      const newContextValue = {
        currentUser: JSON.parse(user),
        logoutUser: logoutUser,
      };
      setContextValue(newContextValue);
    }
  }, []);

  const saveLoggedInUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    const newContextValue = {
      currentUser: userData,
      logoutUser: logoutUser,
    };
    setContextValue(newContextValue);
  };

  return (
    <StylesProvider injectFirst>
      <CssBaseline />
      <div className="App fullHeight">
        <Grid container className="fullHeight">
          <UserProvider value={contextValue}>
            <Switch>
              <Route path="/registration" exact>
                <UserRegistartion />
              </Route>
              <Route path="/login" exact>
                <LoginPage saveLoggedInUser={saveLoggedInUser} />
              </Route>
              <Route path="/conversation" exact>
                <ConversationPage />
              </Route>
              <Route path="/">
                <LoginPage />
              </Route>
            </Switch>
          </UserProvider>
        </Grid>
      </div>
    </StylesProvider>
  );
}

export default App;
