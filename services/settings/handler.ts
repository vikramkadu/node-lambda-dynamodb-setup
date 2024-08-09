import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import { getAllOrganisationSetting } from '.';

export const getOrganizationSettings = async (event: APIGatewayEvent, context: Context, callback: Callback) => {
    return await getAllOrganisationSetting(event, context, callback);
}