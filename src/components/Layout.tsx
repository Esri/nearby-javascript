import React, { useContext, useEffect } from "react";

import { AppContext } from "../contexts/App";
import Container from "./styled/Container";

const Layout = ({ children } : any) => {
  const { setState } = useContext(AppContext);

  let mounted = false;

  useEffect(() => {
    if (!mounted) {
      mounted = true;
      setState({
        mode: "normal"
      })
    }

    return () => mounted = false;
  }, []);

  return <Container>{children}</Container>;
};

export default Layout;