import { Menu, MenuItem, MenuSurfaceAnchor } from '@rmwc/menu';
import React, { useState } from 'react';

import AuthButton from './styled/AuthButton';

import useOAuth from '../hooks/useOAuth';

export const Authentication = () => {
    const [localState, setLocalState] = useState({
        menuIsOpen: false,
    });

    const [authState, signIn, signOut] = useOAuth();

    const onSelect = () => {
        if (authState.isSignedIn) {
            signOut();
        } else {
            signIn();
        }
    };

    const text = authState.isSignedIn ? 'Sign Out' : 'Sign In';

    return (
        <MenuSurfaceAnchor>
            <Menu
                anchorCorner="bottomStart"
                open={localState.menuIsOpen}
                onSelect={onSelect}
                onClose={() => setLocalState({ menuIsOpen: false })}
            >
                <MenuItem>{text}</MenuItem>
            </Menu>

            <AuthButton
                // need to pass in a string value for this comoponent
                signedin={authState.isSignedIn.toString()}
                aria-label="Authenticate"
                alt="Authenticate"
                icon="person_outline"
                onClick={() => setLocalState({ menuIsOpen: !localState.menuIsOpen })}
            />
        </MenuSurfaceAnchor>
    );
};
