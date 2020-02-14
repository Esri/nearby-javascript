import { Snackbar, SnackbarAction } from '@rmwc/snackbar';
import React, { useContext } from 'react';

import { AppContext } from '../contexts/App';

const Notification = () => {
    const { state, setState } = useContext(AppContext);

    const onActionHandler = () => {
        setState({
            position: state.currentPosition,
            redoSearch: true,
        });
    };

    return (
        <Snackbar
            open={state.showNotification}
            onClose={() => setState({ showNotification: false })}
            message="Search for places?"
            timeout={10000}
            action={<SnackbarAction label="Search" onClick={onActionHandler} />}
        />
    );
};

export default Notification;
