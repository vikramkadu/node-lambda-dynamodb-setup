import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { editUserHandler, onboardCreateHandler, registerUserHandler } from '.';

export const registerUser = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    return await registerUserHandler(event, context, callback);
}

export const editUser = async (event: APIGatewayEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> => {
    return await editUserHandler(event, context, callback);
};

export const onboardCreate = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    return await onboardCreateHandler(event, context, callback);
}