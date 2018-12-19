import React, { useContext, useEffect } from "react";
import { Snackbar } from "rmwc/Snackbar";

import { AppContext } from "../contexts/App";

const Notification = () => {
  const { state, setState } = useContext(AppContext);

  useEffect(
    () => {
      setTimeout(() => {
        setState({
          showNotification: false
        });
      }, 5000);
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
    timeout={5000}
    dismissesOnAction={false}
  />;
};

export default Notification;
