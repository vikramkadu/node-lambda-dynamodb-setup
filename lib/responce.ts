import { merge } from 'lodash';
import { NOT_FOUND, ADDED_SUCCESSFULLY, DELETED_SUCCESSFULLY, UPDATED_SUCCESSFULLY, ALREADY_EXISTS, TOKEN_FAILED, INTERNAL_SERVER_ERROR, CONFIRMED_SUCCESS, FORGOT_PASSWORD_SUCCESS, ACCOUNT_LOCKED, INVAILD_CREDENTAILS, ACCOUNT_ALREADY_EXISTS } from "../lib/constants"
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

export const accountExist = (message: string = ACCOUNT_ALREADY_EXISTS, code?: string) => error(400, message, code);

export const tokenFailed = (message: string = TOKEN_FAILED, code?: string) => error(500, message, code);

export const alreadyExists = (message: string = ALREADY_EXISTS, code?: string) => error(403, message, code)

export const addSucess = (message: string = ADDED_SUCCESSFULLY, code?: string) => response(200, message, code);

export const deleteSucess = (message: string = DELETED_SUCCESSFULLY, code?: string) => response(200, message, code);

export const updatedSucess = (message: string = UPDATED_SUCCESSFULLY, code?: string) => response(200, message, code);

export const internalServerError = (message: string = INTERNAL_SERVER_ERROR, code?: string) => error(500, message, code);

export const ConfirmedSuccess = (message: string = CONFIRMED_SUCCESS, code?: string) => response(200, message, code);

export const forgotPasswordSuccess =(message: string = FORGOT_PASSWORD_SUCCESS, code?: string) => response(200, message, code);

export const accountIsLocked = (message: string = ACCOUNT_LOCKED, code?: string) => error(500, message, code);

export const invalidUsernameOrPassword = (message: string = INVAILD_CREDENTAILS, code?: string) => error(500, message, code)
