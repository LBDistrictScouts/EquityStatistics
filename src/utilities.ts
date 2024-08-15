import {getCookie, setCookie} from "typescript-cookie";


export function validateString(input: unknown): input is string {
    return typeof input === 'string' && input.length !== 0
}


export function getOrMakeCookie(cookie_key: string, cookie_generator: Function): string {
    if (!validateString(cookie_key)) {
        throw new Error('Cookie Key is not a valid string.')
    }

    let return_value: string | undefined
    let cookie_value = getCookie(cookie_key)

    if (!validateString(cookie_value)) {
        return_value = cookie_generator()
        setCookie(cookie_key, return_value, {sameSite: 'none', secure: true});
    } else {
        return_value = cookie_value
    }

    if (typeof return_value !== "string") {
        throw new Error('Value must be string.')
    }

    return return_value
}


export function setValidCookie(cookie_key: string, cookie_value: number|string|undefined, attributes: object = {}): string {
    attributes = {sameSite: 'none', secure: true} || attributes

    return setCookie(cookie_key, cookie_value, attributes);
}


export function getOriginDevLocalhost(): string {
    let currentHref = window.location.href
    if (currentHref.includes('localhost')) {
        currentHref = currentHref.replace('http://', 'https://')
    }

    return currentHref
}

/**
 * JSON Object
 */
export type JsonObject = { [Key in string]?: JsonValue }
/**
 * JSON Array
 */
export type JsonArray = JsonValue[]
/**
 * JSON Primitives
 */
export type JsonPrimitive = string | number | boolean | null
/**
 * JSON Values
 */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray

export function isJsonObject<T = JsonObject>(input: unknown): input is T {
    return !(input === null || typeof input !== 'object' || Array.isArray(input));
}

export function assertReadableResponse(response: Response) {
    if (response.bodyUsed) {
        throw new TypeError('"response" body has been used already')
    }
}


type Constructor<T extends {} = {}> = new (...args: any[]) => T

export function looseInstanceOf<T extends {}>(input: unknown, expected: Constructor<T>): input is T {
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