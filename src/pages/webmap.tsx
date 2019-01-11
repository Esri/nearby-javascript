import { RouteComponentProps } from "@reach/router";
import React, { lazy } from "react";

interface RouteProps extends RouteComponentProps {
  isMobile: boolean;
}

// lazy load the core components
const WebMapView = lazy(() => import("../components/WebMapView"));
const WebMap = (props: RouteProps) => <WebMapView />;

export default WebMap;
