import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { editUserHandler, onboardCreateHandler, registerUserHandler } from '.';

export const registerUser = async (event: APIGatewayEvent) => {
    return await registerUserHandler(event);
}

export const editUser = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    return await editUserHandler(event);
};

export const onboardCreate = async (event: APIGatewayEvent) => {
    return await onboardCreateHandler(event);
}