import { NOT_FOUND} from "./constants.mjs"
import { getHeaders } from './getHeaders.mjs';

export const isResponse = () => {
    return {
        statusCode: 200,
        headers: getHeaders(),
    };
};

export const ALLOWED_ORIGINS = [
    'http://localhost:3000'
];

export const cors = (event, response) => {
    const origin = event?.headers?.origin ?? event?.headers?.Origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        response.headers['Access-Control-Allow-Origin'] = "*";
        response.headers['Access-Control-Allow-Headers'] = "Content-Type";
        response.headers['Access-Control-Allow-Credentials'] = true;
        response.headers['Access-Control-Allow-Methods'] = "OPTIONS,POST,GET,PUT";
        response.headers['Access-Control-Expose-Headers'] = 'X-RawRowCount, X-Total-Count, X-HWM';
    }
    return response;
};

export const response = (statusCode, body = undefined, headers = {}) => {
    const standardHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
        "Access-Control-Allow-Credentials": true,
    };
    let bodyAsString;
    if (typeof body === 'string') {
        bodyAsString = body;
    } else {
        bodyAsString = JSON.stringify(body);
    }
    return { statusCode: statusCode, body: bodyAsString };
};

export const error = (statusCode, message, code) => {
    const body = { message: message };
    if (code) {
        body['code'] = code;
    }
    return response(statusCode, body);
};

export const ok = (body = undefined, headers = {}) => response(200, body, headers);

export const notFound = (message = NOT_FOUND, code) => error(404, message, code);

