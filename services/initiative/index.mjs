import { PutCommand,GetCommand } from '@aws-sdk/lib-dynamodb';
import { response } from '../../lib/responce.mjs';
import { DynamoDB } from '../../database/connection.mjs';

export const getInitiativeSettings = async (event) => {
    const org_id = event.headers['org_id'] || '0'; // Default to 0 if not provided

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_INITIATIVE_SETTINGS || '',
            Key: { org_id, type: 'initiative' },
        };
        const command = new GetCommand(params);
        const settingsResponse = await DynamoDB.send(command);

        if (!settingsResponse?.Item) {
            const defaultParams = {
                TableName: process.env.DYNAMODB_TABLE_INITIATIVE_SETTINGS || '',
                Key: { org_id: '0', type: 'initiative' },
            };
            const defaultCommand = new GetCommand(defaultParams);
            const defaultSettingsResponse = await DynamoDB.send(defaultCommand);

            if (!defaultSettingsResponse?.Item) {
                return response(404, 'Initiative settings not found for the organization');
            }

            return response(200, defaultSettingsResponse.Item);
        }

        return response(200, settingsResponse.Item);
    } catch (error) {
        console.error('Error fetching initiative settings:', error.message);
        return response(500, `Error fetching initiative settings: ${error.message}`);
    }
};

export const createInitiative = async (event) => {
    const { initiative_title, initiative_type } = JSON.parse(event.body || '{}');
    if (!initiative_title || !initiative_type || initiative_title.length > 120) {
        return response(400, 'Invalid initiative data. Please check mandatory fields and limits.');
    }

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_INITIATIVES || '',
            Item: {
                initiative_title,
                initiative_type,
                created_at: new Date().toISOString(),
            },
        };
        const command = new PutCommand(params);
        await DynamoDB.send(command);

        return response(201, 'Initiative created successfully');
    } catch (error) {
        console.error('Error creating initiative:', error.message);
        return response(500, `Error creating initiative: ${error.message}`);
    }
};
