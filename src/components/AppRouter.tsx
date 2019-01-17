import { navigate } from "@reach/router"
import React, { useContext, useEffect } from "react";

import { AppContext } from "../contexts/App";
import StyledRouter from "./styled/Router";

const AppRouter = ({ children, location } : any) => {
  const { setState } = useContext(AppContext);

  useEffect(
    () => {
      if (location.pathname === "/map") {
        setState({ mode: "map" });
      } else if (location.pathname === "/list") {
        setState({ mode: "list" });
      } else if (location.pathname === "/") {
        setState({ mode: "normal" });
        // list will be default when transitioning
        // from normal mode
        navigate("/list");
      }

      return () => null;;
    },
    [location]
  );

  return <StyledRouter>{children}</StyledRouter>;
};

export default AppRouter;