import { useEffect, useState } from 'react';

import { appId, portalUrl } from '../config';
import { verifyUserSignedIn } from '../utils/credentials';

export interface OAuthState {
    isSignedIn: boolean;
}

/**
 * Hook to manage authentication
 */
const useOAuth = () => {
    const initialState: OAuthState = {
        isSignedIn: false,
    };

    const [authState, setAuthState] = useState(initialState);

    useEffect(() => {
        const isSignedIn = verifyUserSignedIn();
        if (isSignedIn) {
            setAuthState({ isSignedIn });
        }
    }, []);

    let oauth: any = null;

    const signIn = async () => {
        if (!oauth) {
            oauth = await import('../data/oauth');
        }
        oauth.initialize(appId, portalUrl);
        const credential = await oauth.signIn();
        if (credential) {
            setAuthState({
                isSignedIn: true,
            });
            return true;
        } else {
            return false;
        }
    };

    const signOut = async () => {
        if (!oauth) {
            oauth = await import('../data/oauth');
            oauth.initialize(appId, portalUrl);
        }
        oauth.signOut();
        setAuthState({ isSignedIn: false });
    };

    const setAuth = (signin: boolean) => signin ? signIn() : signOut();

    return [authState, setAuth];
};

export default useOAuth;
