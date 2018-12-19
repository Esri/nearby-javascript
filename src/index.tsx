import "./config";

import { Location } from "@reach/router";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import AppBar from "./components/AppBar";
import CategoryFilter from "./components/CategoryFilter";
import Notification from "./components/Notification";
import AppContainer from "./components/styled/AppContainer";
import { Placeholder } from "./components/styled/Placeholder";
import StyledRouter from "./components/styled/Router";
import AppThemeProvider from "./components/styled/ThemeProvider";
import { AppProvider } from "./contexts/App";

import Home from "./pages/home";
import WebMap from "./pages/webmap";

ReactDOM.render(
  <AppThemeProvider
    options={{
      primary: "#2196f3",
      secondary: "#000"
    }}
  >
    <AppContainer>
      <Location>
        {({ location }: any) => (
          <AppProvider location={location}>
            <AppBar />
            <Suspense fallback={<Placeholder />}>
              <StyledRouter>
                <Home path="/" />
                <WebMap path="/map" />
              </StyledRouter>
            </Suspense>
            <Notification />
            <CategoryFilter />
          </AppProvider>
        )}
      </Location>
    </AppContainer>
  </AppThemeProvider>,
  document.getElementById("root")
);
