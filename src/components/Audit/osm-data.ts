import {as, authenticatedResourceRequest, checkAuthenticated, processChallenges} from './authenticate';
import * as oauth from "oauth4webapi";
import {assertReadableResponse, isJsonObject, JsonValue, looseInstanceOf} from "../../utilities";


interface Term {
    enddate: string
    name: string
    startdate: string
    term_id: number
}

interface Upgrades {
    accounts: boolean
    at_home: boolean
    badges: boolean
    campsiteexternalbookings: boolean
    chat: boolean
    details: boolean
    emailbolton: boolean
    events: boolean
    filestorage: boolean
    level: string
    programme: boolean
}

interface Section {
    group_id: number
    group_name: string
    section_id: number
    section_name: string
    section_type: string
    terms: [Term]
    upgrades: Upgrades
}

export interface UserProfile {
    email: string
    full_name: string
    has_parent_access: boolean
    has_section_access: boolean
    profile_picture_url: string
    scopes: [string]
    sections: [Section]
    user_id: number
}

export interface UserResponse {
    data: UserProfile | undefined
    error: null | string
}


export async function processUserInfo(response: Response): Promise<UserResponse> {
    if (!looseInstanceOf(response, Response)) {
        throw new TypeError('"response" must be an instance of Response')
    }

    if (response.status !== 200) {
        throw new Error('"response" was not successful.')
    }

    let json: JsonValue

    assertReadableResponse(response)
    try {
        json = await response.json()
    } catch (cause) {
        throw new Error('failed to parse "response" body as JSON', {cause})
    }

    if (!isJsonObject<UserResponse>(json)) {
        throw new Error('"response" body must be a top level object')
    }

    return json
}


export async function userResourceInfo(): Promise<UserResponse> {
    if (!checkAuthenticated()) {
        console.log('Unauthenticated User Resource Info')
        return {
            data: undefined,
            error: 'Not Authenticated.',
        };
    }

    function resolveEndpoint(
        as: oauth.AuthorizationServer,
        endpoint: keyof oauth.AuthorizationServer
    ) {
        function validateEndpoint(
            value: unknown,
            endpoint: keyof oauth.AuthorizationServer
        ) {
            if (typeof value !== 'string') {
                throw new TypeError(`"as.${endpoint}" must be a string`)
            }

            return new URL(value)
        }

        return validateEndpoint(as[endpoint], endpoint)
    }

    const userInfoUrl = resolveEndpoint(as, 'userinfo_endpoint')

    const headers = new Headers()
    headers.set('accept', 'application/json')

    const response = await authenticatedResourceRequest('GET', userInfoUrl, headers)

    processChallenges(response)

    return processUserInfo(response)
}

export const userSectionInfo = await userResourceInfo().then((response) => {
    if (typeof response === 'undefined') {
        throw new Error('Not Authenticated')
    }
    return response.data
});


export async function getData(): Promise<void> {

    const response = await authenticatedResourceRequest(
        'POST',
        new URL('https://t3sbhazov3.execute-api.eu-west-1.amazonaws.com/equity/data')
    )

    processChallenges(response)
    console.log('Protected Resource Response', await response.json())
}