import Credential from 'esri/identity/Credential';
import IdentityManager from 'esri/identity/IdentityManager';
import OAuthInfo from 'esri/identity/OAuthInfo';

export let credential: Credential | null;
let oauthInfo: OAuthInfo;

/**
 * Register application ID and Portal URL
 * with the IdentityManager
 * @param appId
 * @param portalUrl
 */
export const initialize = (appId: string, portalUrl: string) => {
    if (!oauthInfo) {
        oauthInfo = new OAuthInfo({
            appId,
            portalUrl,
            popup: true,
        });
        IdentityManager.registerOAuthInfos([oauthInfo]);
    }
};

/**
 * Check current logged in status for current portal
 */
export const checkCurrentStatus = () => IdentityManager.checkSignInStatus(`${oauthInfo.portalUrl}/sharing`);

/**
 * Attempt to sign in,
 * first check current status
 * if not sighned in, then go through
 * steps to get credentials
 */
export const signIn = async () => {
    if (!credential) {
        try {
            credential = await checkCurrentStatus();
        } catch (error) {
            credential = await fetchCredentials();
        }
    }
    return credential;
};

/**
 * Sign the user out, but if we checked credentials
 * manually, make sure they are registered with
 * IdentityManager, so it can destroy them properly
 */
export const signOut = async () => {
    // make sure the identitymanager has
    // the credential so it can destroy it
    await signIn();
    IdentityManager.destroyCredentials();
};

/**
 * Get the credentials for the provided portal
 */
export const fetchCredentials = async () => {
    credential = await IdentityManager.getCredential(`${oauthInfo.portalUrl}/sharing`, {
        error: null as any,
        oAuthPopupConfirmation: false,
        token: null as any,
    });

    return credential;
};
