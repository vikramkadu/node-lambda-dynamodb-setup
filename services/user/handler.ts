import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { editUserHandler, registerUserHandler } from '.';

module.exports.registerUser = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    return await registerUserHandler(event, context, callback);
}

export const editUser = async (event: APIGatewayEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> => {
    return await editUserHandler(event, context, callback);
};
