import Credential from "esri/identity/Credential";
import IdentityManager from "esri/identity/IdentityManager";
import OAuthInfo from "esri/identity/OAuthInfo";

export let credential: Credential | null;
let oauthInfo: OAuthInfo;

export const initialize = (appId: string, portalUrl: string) => {
  if (!oauthInfo) {
    oauthInfo = new OAuthInfo({
      appId, portalUrl, popup: true
    });
    IdentityManager.registerOAuthInfos([oauthInfo]);
  }
}

export const checkCurrentStatus = () => (
  IdentityManager.checkSignInStatus(`${oauthInfo.portalUrl}/sharing`)
);

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

export const signOut = async () => {
  // make sure the identitymanager has
  // the credential so it can destroy it
  await signIn();
  IdentityManager.destroyCredentials();
  location.reload();
};

export const fetchCredentials = async () => {
  credential = await IdentityManager.getCredential(
    `${oauthInfo.portalUrl}/sharing`,
    {
      error: null as any,
      oAuthPopupConfirmation: false,
      token: null as any
    }
  );

  return credential;
}