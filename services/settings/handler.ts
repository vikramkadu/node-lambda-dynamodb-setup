import { APIGatewayEvent, Context, Callback } from 'aws-lambda';
import { getAllOrganisationSetting } from '.';

export const getOrganizationSettingsByName = async (event: APIGatewayEvent) => {
    return await getAllOrganisationSetting(event);
}

export const getOrganizationSettingsById = async (event: APIGatewayEvent) => {
    return await getAllOrganisationSetting(event);
}