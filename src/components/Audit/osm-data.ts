import {as, authenticatedResourceRequest, checkAuthenticated, processChallenges} from './authenticate';
import {assertReadableResponse, isJsonObject, JsonValue, looseInstanceOf} from "../../utilities";
import {getCookie} from "typescript-cookie";

// @ts-ignore
import * as oauth from "oauth4webapi";

const data_url: URL = new URL('https://t3sbhazov3.execute-api.eu-west-1.amazonaws.com/equity/data');


export interface Term {
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

export interface Section {
    group_id: number
    group_name: string
    section_id: number
    section_name: string
    section_type: 'squirrels' | 'beavers' | 'cubs' | 'scouts' | 'explorers' | 'waiting' | 'adults'
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


export interface MemberRecord {
    photo_guid: string
    patrol: string
    started: string
    joined: string
    age: string
    patrol_role_level_label: string
    active: boolean
    read_only: any[]
    first_name: string
    last_name: string
    member_id: number
    pic: boolean
    patrol_id: number
    patrol_role_level: number
    end_date: any
    section_id: number
    date_of_birth: string
    custom_data: {
        [n: number]: {
            [n: number]: string
        }
    }
    age_years: number
    age_months: number
    _filterString: string
}

export interface RecordList {
    [n: number]: MemberRecord
}

export interface DataResponse {
    data: RecordList | undefined
    error: null | string
    unfilteredData: RecordList | undefined
    filteredOutCount: number | undefined
}

export interface ExtractRecord {
    memberId: number
    sectionId: number
    ageYears: number
    ageMonths: number
    selectedPostcode: string
    otherPostcodes: string[]
}


export function getExtractionData(memberRecord: MemberRecord): ExtractRecord  {

    const cd = memberRecord.custom_data

    const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/gi;
    const postcodeSpaceMissingRegex = /^[A-Z]{1,2}[0-9]{2,3}[A-Z]{2}$/gi;

    let postcodes: string[];
    let postcodeObj: {[pathKey: string]: string} = {}

    const formatPostcode = (postcode: string) => {
        postcode = postcode.toUpperCase()

        if (postcodeSpaceMissingRegex.test(postcode)) {
            postcode = postcode.slice(0, 3) + ' ' + postcode.slice(3)
        }

        return postcode
    }

    const priorityPostcode = (postcodes: {[path: string]: string}): string => {
        enum priorityList {
            Member = '6.11',
            ContactOne = '1.11',
            ContactTwo = '2.11'
        }

        for (const priority of Object.values(priorityList)) {
            if (postcodes.hasOwnProperty(priority)) {
                return postcodes[priority]
            }
        }

        return Object.values(postcodeObj)[0]
    }

    for (const key in cd) {
        if (cd.hasOwnProperty(key)) {
            let path = String(key);
            const value = cd[key];

            if (key === '4') {
                continue;
            }

            for (const subKey in value) {
                if (value.hasOwnProperty(subKey)) {
                    const subPath = path + '.' + subKey;
                    const postcode = value[subKey];

                    if (postcodeRegex.test(postcode)) {
                        // console.log(`[${subPath}]: ${postcode}`);
                        postcodeObj[subPath] = formatPostcode(postcode);
                    }
                }
            }
        }
    }

    postcodes = [...new Set(Object.values(postcodeObj))]

    return (
        {
            memberId: memberRecord.member_id,
            sectionId: memberRecord.section_id,
            ageMonths: memberRecord.age_months,
            ageYears: memberRecord.age_years,
            otherPostcodes: postcodes,
            selectedPostcode: priorityPostcode(postcodeObj)
        }
    )
}


export const getDataFromIds = (idList: number[], gridData: RecordList|undefined): ExtractRecord[] => {
    const getMemberRecord = (id: number) : MemberRecord => {
        if (!gridData || !isJsonObject<RecordList>(gridData)) {
            throw new Error('No records found.')
        }

        return gridData[id];
    }

    let extractList: ExtractRecord[] = []

    for (const id of idList) {
        const memberRecord = getMemberRecord(id);
        extractList.push(getExtractionData(memberRecord));
    }

    return extractList;
}


export async function processGridData(response: Response): Promise<DataResponse> {
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

    if (!isJsonObject<DataResponse>(json)) {
        throw new Error('"response" body must be a top level object')
    }

    let sourceGridData = json.data
    let gridData: RecordList = {}
    let filteredOutCount: number = 0

    if (isJsonObject<RecordList>(sourceGridData)) {
        for (const key in sourceGridData) {
            const memberRecord = sourceGridData[key]

            if (memberRecord.patrol_id >= 0) {
                gridData[key] = memberRecord
            } else {
                // console.log(memberRecord.patrol_id, memberRecord.first_name + ' ' + memberRecord.last_name)
                filteredOutCount++
            }
        }

        return {
            error: null,
            data: gridData,
            unfilteredData: gridData,
            filteredOutCount: filteredOutCount
        }
    }

    return {
        error: 'No Records Found in Response.',
        data: undefined,
        unfilteredData: undefined,
        filteredOutCount: undefined,
    }
}

export const checkSectionIdSet = (): boolean => {
    return !(!getCookie('section-id'))
}

export const checkTermIdSet = (): boolean => {
    return !(!getCookie('term-id'))
}

export async function getGridData(): Promise<DataResponse> {
    if (!checkAuthenticated()) {
        console.log('Unauthenticated User Resource Info')
        return {
            filteredOutCount: undefined,
            unfilteredData: undefined,
            data: undefined,
            error: 'Not Authenticated.'
        };
    }

    const sectionId = getCookie('section-id');
    const termId = getCookie('term-id');

    if (!sectionId || !termId) {
        console.log('Section ID and or Term ID is missing.')
        return {
            filteredOutCount: undefined,
            unfilteredData: undefined,
            data: undefined,
            error: 'No Term or Section.'
        }
    }

    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    headers.set('accept', 'application/json');

    const urlencoded = new URLSearchParams();
    urlencoded.append("section_id", sectionId);
    urlencoded.append("term_id", termId);

    const response = await authenticatedResourceRequest('POST', data_url, headers, urlencoded)

    return processGridData(response)
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