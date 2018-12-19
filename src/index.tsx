import "./config";

import { Location } from "@reach/router";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";

import AppBar from "./components/AppBar";
import Notification from "./components/Notification";
import AppContainer from "./components/styled/AppContainer";
import { Placeholder } from "./components/styled/Placeholder";
import StyledRouter from "./components/styled/Router";
import { AppProvider } from "./contexts/App";

import Home from "./pages/home";
import WebMap from "./pages/webmap";

ReactDOM.render(
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
        </AppProvider>
      )}
    </Location>
  </AppContainer>,
  document.getElementById("root")
);
