import "./config";

import { Location } from "@reach/router";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import Media from "react-media";

import AppBar from "./components/AppBar";
import AppRouter from "./components/AppRouter";
import CategoryFilter from "./components/CategoryFilter";
import Layout from "./components/Layout";
import Notification from "./components/Notification";
import AppContainer from "./components/styled/AppContainer";
import { Placeholder } from "./components/styled/Placeholder";
import AppThemeProvider from "./components/styled/ThemeProvider";
import { AppProvider } from "./contexts/App";

import Home from "./pages/home";
import List from "./pages/list";
import WebMap from "./pages/webmap";

const DEVICE_WIDTH = 800;

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
              <Media query={`(max-width: ${DEVICE_WIDTH}px)`}>
              {(matches: any) =>
                // need to manually check the page width
                // because safari https://github.com/ArcGIS/nearby-javascript/issues/2
                matches || document.body.clientWidth < DEVICE_WIDTH ? (
                  <AppRouter location={location}>
                    <List path="/list" />
                    <WebMap path="/map" />
                  </AppRouter>
                ) : (
                  <Layout>
                    <Home />
                  </Layout>
                )}
              </Media>
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
