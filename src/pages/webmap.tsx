import { RouteComponentProps } from "@reach/router";
import React, { lazy } from "react";

// lazy load the core components
const WebMapView = lazy(() => import("../components/WebMapView"));
const WebMap = (props: RouteComponentProps) => <WebMapView />;

export default WebMap;
