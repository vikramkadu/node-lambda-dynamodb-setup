import { merge } from 'lodash';
import { NOT_FOUND} from "../lib/constants"
import { getHeaders } from './getHeaders';

export const isResponse = () => {
    return {
        statusCode: 200,
        headers: getHeaders(),
    }
}

export const ALLOWED_ORIGINS = [
    'http://localhost:3000'
];

export const cors = (event: any, response: any): any => {
    const origin = event?.headers?.origin ?? event?.headers?.Origin;
    if (ALLOWED_ORIGINS.includes(origin)) {
        response.headers['Access-Control-Allow-Origin'] = "*";
        response.headers['Access-Control-Allow-Headers'] = "Content-Type";
        response.headers['Access-Control-Allow-Credentials'] = true;
        response.headers['Access-Control-Allow-Methods'] = "OPTIONS,POST,GET,PUT";
        response.headers['Access-Control-Expose-Headers'] = 'X-RawRowCount, X-Total-Count, X-HWM';
    }
    return response;

}

export const response = (statusCode: number, body: any = undefined, headers: Object = {}): any => {
    const standardHeaders = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
        "Access-Control-Allow-Credentials": true,
    }
    var bodyAsString: string;
    if (typeof body === 'string') {
        bodyAsString = body;
    } else {
        bodyAsString = JSON.stringify(body);
    }
    return { statusCode: statusCode, body: bodyAsString, headers: merge(standardHeaders, headers) };
};

export const error = (statusCode: number, message: string, code?: string): any => {
    const body = { message: message } as any;
    if (code) {
        body['code'] = code;
    }
    return response(statusCode, body);
};

export const ok = (body: any = undefined, headers: Object = {}) => response(200, body, headers)

export const notFound = (message: string = NOT_FOUND, code?: string) => error(404, message, code);