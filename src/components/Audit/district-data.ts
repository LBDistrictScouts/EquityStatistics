import {ExtractRecord} from "./osm-data";
import {getOriginDevLocalhost} from "../../utilities";

export interface DataSubmission {
    groupName: string;
    groupId: number;

    sectionName: string;
    sectionId: number;
    sectionType: 'squirrels' | 'beavers' | 'cubs' | 'scouts' | 'explorers' | 'waiting' | 'adults'

    userName: string
    userEmail: string
    userId: number

    submissionTimestamp: string

    members: ExtractRecord[]
}

if (!process.env.REACT_APP_SUBMIT_URL) {
    throw new Error('Missing REACT_APP_SUBMIT_URL')
}
const submit_url: URL = new URL(process.env.REACT_APP_SUBMIT_URL);


export async function submitData(data: DataSubmission): Promise<Response> {
    const headers = new Headers()
    headers.set('accept', 'application/json')
    headers.set('Origin', getOriginDevLocalhost())

    const request = new Request(submit_url, {
        body: JSON.stringify(data),
        headers: headers,
        method: 'POST'
    })

    return fetch(request);
}



