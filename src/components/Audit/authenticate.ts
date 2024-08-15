import {getCookie, removeCookie} from 'typescript-cookie'
import {getOriginDevLocalhost, getOrMakeCookie, setValidCookie, validateString} from "../../utilities";
import moment from "moment";

// @ts-ignore
import * as oauth from 'oauth4webapi';

// Prerequisites
if (!process.env.REACT_APP_MANIFEST_URL) {
    throw new Error('Missing REACT_APP_MANIFEST_URL')
}
const manifest_url: URL = new URL(process.env.REACT_APP_MANIFEST_URL);

if (!process.env.REACT_APP_ISSUER_URL) {
    throw new Error('Missing REACT_APP_ISSUER_URL')
}
const issuer_url: URL = new URL(process.env.REACT_APP_ISSUER_URL);

if (!process.env.REACT_APP_CLIENT_ID) {
    throw new Error('Missing REACT_APP_CLIENT_ID')
}
const client_id: string = process.env.REACT_APP_CLIENT_ID;

if (!process.env.REACT_APP_REDIRECT_URI) {
    throw new Error('Missing REACT_APP_REDIRECT_URI')
}
const redirect_uri: string = process.env.REACT_APP_REDIRECT_URI;

if (!process.env.REACT_APP_SCOPE) {
    throw new Error('Missing REACT_APP_SCOPE')
}
const scope: string = process.env.REACT_APP_SCOPE;

const algorithm:
    | 'oauth2' /* For .well-known/oauth-authorization-server discovery */
    | 'oidc' /* For .well-known/openid-configuration discovery */
    | undefined = 'oidc';

export const as = await oauth
    .discoveryRequest(manifest_url, {algorithm})
    .then((response) => oauth.processDiscoveryResponse(issuer_url, response))


const client: oauth.Client = {
    client_id,
    token_endpoint_auth_method: 'none',
}

const code_challenge_method = 'S256'

/**
 * The following MUST be generated for every redirect to the authorization_endpoint. You must store
 * the code_verifier and nonce in the end-user session such that it can be recovered as the user
 * gets redirected from the authorization server back to your application.
 */

function getCodeVerifier(): string {
    return getOrMakeCookie('auth-code', oauth.generateRandomCodeVerifier)
}

const code_challenge = await oauth.calculatePKCECodeChallenge(getCodeVerifier())


function getState(): string {
    return getOrMakeCookie('auth-state', oauth.generateRandomState)
}


function check_expired(cookie_key: string): boolean {
    const makeNowString = function(): string {
        return moment().add(1, 'hour').toISOString();
    }

    const expiry_time = moment(getOrMakeCookie(cookie_key, makeNowString));
    const now_time = moment();

    return now_time.isAfter(expiry_time);
}


const access_token_cookie_key = 'access-token';
const access_token_cookie_expiry_key = access_token_cookie_key + '-expiry'


export function getAccessToken(): string | undefined {
    if (check_expired(access_token_cookie_expiry_key)) {
        console.log('Cleaned Expired Access Token Cookie.')
        removeCookie(access_token_cookie_key);
        removeCookie(access_token_cookie_expiry_key);
    }

    return getCookie(access_token_cookie_key);
}


function setAccessToken(tokenValue: string): void {
    if (check_expired(access_token_cookie_expiry_key)) {
        removeCookie(access_token_cookie_key);
        removeCookie(access_token_cookie_expiry_key);
    }

    setValidCookie(access_token_cookie_key, tokenValue, {sameSite: 'none', secure: true});
}


export function checkAuthenticated(): boolean {
    let token = getAccessToken()
    return typeof token === "string";
}

export function checkCodeInUrl(): boolean {
    const currentUrl: URL = new URL(window.location.href)
    return currentUrl.searchParams.has('code');
}


export function getRedirect(): string {
    // redirect user to auth_server.authorization_endpoint
    const authorizationUrl = new URL(as.authorization_endpoint!)
    authorizationUrl.searchParams.set('client_id', client.client_id)
    authorizationUrl.searchParams.set('redirect_uri', redirect_uri)
    authorizationUrl.searchParams.set('response_type', 'code')
    authorizationUrl.searchParams.set('scope', scope)
    authorizationUrl.searchParams.set('code_challenge', code_challenge)
    authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method)

    /**
     * We cannot be sure the AS supports PKCE therefore we're going to use state too. Use of PKCE is
     * backwards compatible even if the AS doesn't support it which is why we're using it regardless.
     */
    if (as.code_challenge_methods_supported?.includes('S256') !== true) {
        authorizationUrl.searchParams.set('state', getState())
    }

    return authorizationUrl.href;
}

// async function processCode(access_code: string) {


// one eternity later, the user lands back on the redirect_uri
// Authorization Code Grant Request & Response

export async function processCode(): Promise<void> {
    let currentHref = getOriginDevLocalhost()
    const currentUrl: URL = new URL(currentHref)

    const params = oauth.validateAuthResponse(as, client, currentUrl, getState())
    if (oauth.isOAuth2Error(params)) {
        console.error('Error Response', params)
        throw new Error() // Handle OAuth 2.0 redirect error
    }

    const response = await oauth.authorizationCodeGrantRequest(
        as,
        client,
        params,
        redirect_uri,
        getCodeVerifier(),
    )

    let challenges: oauth.WWWAuthenticateChallenge[] | undefined
    if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
        for (const challenge of challenges) {
            console.error('WWW-Authenticate Challenge', challenge)
        }
        throw new Error() // Handle WWW-Authenticate Challenges as needed
    }

    const result = await oauth.processAuthorizationCodeOAuth2Response(as, client, response)
    if (oauth.isOAuth2Error(result)) {
        console.error('Error Response', result)
        throw new Error() // Handle OAuth 2.0 response body error
    }

    console.log('Access Token Response', result)
    setAccessToken(result.access_token)
    window.location.href = '/'
}

type Constructor<T extends {} = {}> = new (...args: any[]) => T

function looseInstanceOf<T extends {}>(input: unknown, expected: Constructor<T>): input is T {
    if (input == null) {
        return false
    }

    try {
        return (
            input instanceof expected ||
            Object.getPrototypeOf(input)[Symbol.toStringTag] === expected.prototype[Symbol.toStringTag]
        )
    } catch {
        return false
    }
}

export async function authenticatedResourceRequest(
    method: string,
    url: URL,
    headers?: Headers,
    body?:
        | ReadableStream
        | Blob
        | ArrayBufferView
        | ArrayBuffer
        | FormData
        | URLSearchParams
        | string
        | null
): Promise<Response> {
    const accessToken = getAccessToken()

    if (!validateString(accessToken)) {
        throw new TypeError('"accessToken" must be a non-empty string')
    }

    if (!(url instanceof URL)) {
        throw new TypeError('"url" must be an instance of URL')
    }

    function prepareHeaders(input?: [string, string][] | Record<string, string> | Headers): Headers {
        if (looseInstanceOf(input, Headers)) {
            input = Object.fromEntries(input.entries())
        }
        const headers = new Headers(input)

        if (headers.has('authorization')) {
            throw new TypeError('"options.headers" must not include the "authorization" header name')
        }
        return headers
    }

    headers = prepareHeaders(headers)
    headers.set('Origin', getOriginDevLocalhost())
    headers.set('authorization', `Bearer ${accessToken}`)

    const request = new Request(url, {
        body,
        headers,
        method,
        mode: 'cors',
    })

    return fetch(request);
}

export function processChallenges(response: Response): void {
    let challenges: oauth.WWWAuthenticateChallenge[] | undefined
    if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
        for (const challenge of challenges) {
            console.error('WWW-Authenticate Challenge', challenge)
        }
        throw new Error() // Handle WWW-Authenticate Challenges as needed
    }
}

export class UnauthenticatedError implements Error {
    message: string;
    name: string;

    constructor(message: string) {
        this.message = message
        this.name = 'UnauthenticatedError'
    }
}