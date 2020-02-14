import { portalUrl } from '../config';

/**
 * Check if the credential has expired
 * @param credential
 * @param now
 */
const isNotExpiredCredential = (credential: { expires: number }, now: number) => {
    return credential.expires > now;
};

/**
 * Parse any locally stored credentials
 * @param localCreds
 * @param sessionCreds
 */
const parseCredentials = (localCreds: string | null, sessionCreds: string | null) => {
    let localValid = false;
    let sessionValid = false;

    if (localCreds) {
        const cred = JSON.parse(localCreds);
        const portalCreds = cred['/'][portalUrl];
        localValid = portalCreds && isNotExpiredCredential(portalCreds, Date.now());
    }
    if (sessionCreds) {
        const cred = JSON.parse(sessionCreds);
        const portalCreds = cred['/'][portalUrl];
        sessionValid = portalCreds && isNotExpiredCredential(portalCreds, Date.now());
    }
    return localValid || sessionValid;
};

/**
 * Manually verify if the user has previsouly signed in
 */
export const verifyUserSignedIn = () => {
    const session = sessionStorage.getItem('esriJSAPIOAuth');
    const local = localStorage.getItem('esriJSAPIOAuth');
    return parseCredentials(local, session);
};
