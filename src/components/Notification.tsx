import { Snackbar } from "@rmwc/snackbar";
import React, { useContext } from "react";

import { AppContext } from "../contexts/App";

const Notification = () => {
  const { state, setState } = useContext(AppContext);

  const onActionHandler = () => {
    setState({
      position: state.currentPosition,
      redoSearch: true
    });
  }

  return <Snackbar
    show={state.showNotification}
    onHide={() => setState({ showNotification: false })}
    message="Search for places?"
    actionText="Search"
    actionHandler={onActionHandler}
    timeout={3000}
    dismissesOnAction={false}
  />;
};

export default Notification;
