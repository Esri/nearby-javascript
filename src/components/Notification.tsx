import { Snackbar } from "@rmwc/snackbar";
import React, { useContext, useEffect } from "react";

import { AppContext } from "../contexts/App";

const Notification = () => {
  const { state, setState } = useContext(AppContext);

  let timeout: NodeJS.Timeout | null;

  useEffect(
    () => {
      if (timeout == null) {
        timeout = setTimeout(() => {
          setState({
            showNotification: false
          });
          clearTimeout(timeout as NodeJS.Timeout);
          timeout = null;
        }, 3000);
      }
      return () => {
        if (timeout) {
          clearTimeout(timeout as NodeJS.Timeout);
        }
        timeout = null;
      };
    },
    [state.showNotification]
  );

  const onActionHandler = () => {
    setState({
      position: state.currentPosition
    });
  }

  return <Snackbar
    show={state.showNotification}
    message="Search for places?"
    actionText="Search"
    actionHandler={onActionHandler}
    timeout={3000}
    dismissesOnAction={true}
  />;
};

export default Notification;
