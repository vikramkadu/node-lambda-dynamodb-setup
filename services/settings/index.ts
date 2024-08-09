import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyResult} from 'aws-lambda';
import { DynamoDB } from '../../database/connection';
import { response } from '../../lib/responce';
import { ORGANIZATION_NOT_FOUND } from '../../lib/constants';

// Helper function to query organization
const queryOrganization = async (org_name: string) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE_ORGANIZATIONS || '',
        KeyConditionExpression: 'org_name = :org_name',
        ExpressionAttributeValues: { 'org_name': org_name },
    };
    const command = new QueryCommand(params);
    return await DynamoDB.send(command);
};

// Helper function to get organization settings
const getOrganizationSettings = async (organization_id: string) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE_ORGANIZATION_SETTINGS || '',
        Key: { organization_id, settings: 'settings' },
    };
    const command = new GetCommand(params);
    return await DynamoDB.send(command);
};

// Main handler function
export const getAllOrganisationSetting = async (event: any): Promise<APIGatewayProxyResult> => {
    const { org_name } = event.pathParameters;
    try {
        // Query the organization by name
        const orgResponse = await queryOrganization(org_name);
        console.log('Organization query response:', orgResponse);

        if (orgResponse?.Items?.length === 0) {
            return response(404, ORGANIZATION_NOT_FOUND);
        }

        const organization_id =orgResponse?.Items && orgResponse?.Items[0]?.email;

        // Get organization settings by organization ID
        const settingsResponse = await getOrganizationSettings(organization_id);
        console.log('Settings query response:', settingsResponse);

        if (!settingsResponse?.Item) {
            return response(404, 'Settings not found for the organization');
        }

        return response(200, {
            organization_name: org_name,
            settings: settingsResponse.Item.dropdowns,
            styles: settingsResponse.Item.styles,
        });

    } catch (error) {
        console.error('Error fetching organization settings:', error.message);
        return response(500, `Error fetching organization settings: ${error.message}`);
    }
};
