export interface HttpRequest{
    method: string;
    url: string;
    headers: { [key: string]: string };
    body?: any;
    params: { [key: string]: string };
    queryParams: { [key: string]: string };
}

export interface HttpResponse{
    status: number;
    headers: { [key: string]: string };
    body: any;
}


export const HttpMessage: { [key: string]: HttpResponse } = {
    NOT_FOUND: {
        status: 404,
        headers: {},
        body: "404 Not found"
    },
    BAD_REQUEST: {
        status: 400,
        headers: {},
        body: "400 Bad request"
    },
    UNAUTHORIZED: {
        status: 401,
        headers: {},
        body: "401 Unauthorized"
    },
    FORBIDDEN: {
        status: 403,
        headers: {},
        body: "403 Forbidden"
    },
    INTERNAL_SERVER_ERROR: {
        status: 500,
        headers: {},
        body: "500 Internal Server Error"
    },
    SERVICE_UNAVAILABLE: {
        status: 503,
        headers: {},
        body: "503 Service Unavailable"
    },
    CREATED: {
        status: 201,
        headers: {},
        body: "201 Created"
    },
    ACCEPTED: {
        status: 202,
        headers: {},
        body: "202 Accepted"
    },
    NO_CONTENT: {
        status: 204,
        headers: {},
        body: "204 No Content"
    },
    CONFLICT: {
        status: 409,
        headers: {},
        body: "409 Conflict"
    },
    METHOD_NOT_ALLOWED: {
        status: 405,
        headers: {},
        body: "405 Method Not Allowed"
    },
    UNSUPPORTED_MEDIA_TYPE: {
        status: 415,
        headers: {},
        body: "415 Unsupported Media Type"
    }
};
