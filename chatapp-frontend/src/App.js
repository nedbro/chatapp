import { CssBaseline, Grid } from "@material-ui/core";
import {
  createMuiTheme,
  responsiveFontSizes,
  StylesProvider,
  ThemeProvider,
} from "@material-ui/core/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import ConversationPage from "./routes/conversation/ConversationPage";
import LoginPage from "./routes/login/LoginPage";
import UserRegistartion from "./routes/registration/UserRegistration";
import { SERVER_URL } from "./utils/Constants";
import { UserProvider } from "./utils/UserContext";

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

function App() {
  const history = useHistory();
  const user = localStorage.getItem("user");

  const logoutUser = () => {
    setContextValue(defaultContextValue);
    localStorage.removeItem("user");

    axios
      .post(SERVER_URL + "/auth/logout", {
        withCredentials: true,
      })
      .then(() => history.push("/login"))
      .catch(() => history.push("/login"));
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
    <>
      <StylesProvider injectFirst>
        <ThemeProvider theme={theme}>
          <div className="App fullHeight">
            <Grid container className="fullHeight">
              <UserProvider value={contextValue}>
                <Switch>
                  <Route path="/registration" exact>
                    <UserRegistartion saveLoggedInUser={saveLoggedInUser} />
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
        </ThemeProvider>
      </StylesProvider>
    </>
  );
}

export default App;
