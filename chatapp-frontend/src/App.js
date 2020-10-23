import { Grid } from "@material-ui/core";
import {
  createMuiTheme,
  responsiveFontSizes,
  StylesProvider,
  ThemeProvider
} from "@material-ui/core/styles";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { Routes } from "./routing/Routes";
import { AuthProvider } from "./utils/AuthProvider";

let theme = createMuiTheme();
theme = responsiveFontSizes(theme);

function App() {
  return (
    <StylesProvider injectFirst>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <div className="App fullHeight">
            <Grid container className="fullHeight">
              <BrowserRouter>
                <Routes />
              </BrowserRouter>
            </Grid>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </StylesProvider>
  );
}

export default App;
