import React, { useContext, useEffect } from "react";

import { AppContext } from "../contexts/App";
import Container from "./styled/Container";

const Layout = ({ children } : any) => {
  const { setState } = useContext(AppContext);

  useEffect(
    () => {
      setState({
        mode: "normal"
      })
    },
    []
  );

  return <Container>{children}</Container>;
};

export default Layout;