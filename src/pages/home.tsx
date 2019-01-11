import { RouteComponentProps } from "@reach/router";
import React, { lazy } from "react";
import Layout from "../components/Layout";

interface RouteProps extends RouteComponentProps {
  isMobile: boolean;
}

// lazy load the core components
const NearbyPlaces = lazy(() => import("../components/NearbyPlaces"));
const WebMapView = lazy(() => import("../components/WebMapView"));
const Home = (props: RouteProps) =>
  <Layout>
    <NearbyPlaces />
    <WebMapView />
  </Layout>;

export default Home;
