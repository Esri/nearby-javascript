import { useEffect, useReducer } from "react";

import { appId, portalUrl } from "../config";
import { verifyUserSignedIn } from "../utils/credentials";

/**
 * Hook to manage authentication
 */
const useOAuth = () => {

  const initialState = {
    isSignedIn: false
  };

  const [authState, setAuthState] = useReducer<any, {}>(
    (currentState, newState) => ({ ...currentState, ...newState }),
    initialState
  );

  useEffect(
    () => {
      const isSignedIn = verifyUserSignedIn();
      if (isSignedIn) {
        setAuthState({ isSignedIn });
      }
    },
    []
  );

  let oauth: any = null;

  const signIn = async () => {
    if (!oauth) {
      oauth = await import("../data/oauth");
    }
    oauth.initialize(appId, portalUrl);
    const credential = await oauth.signIn();
    if (credential) {
      setAuthState({
        isSignedIn: true
      });
      return true;
    }
    else {
      return false;
    }
  };

  const signOut = async () => {
    if (!oauth) {
      oauth = await import("../data/oauth");
      oauth.initialize(appId, portalUrl);
    }
    oauth.signOut();
    setAuthState({ isSignedIn: false });
  };

  return [ authState, signIn, signOut ];

}

export default useOAuth;