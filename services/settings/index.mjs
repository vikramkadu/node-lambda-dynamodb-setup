'use strict';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { response } from '../../lib/responce.mjs';
import { DynamoDB } from '../../database/connection.mjs';
import {  DEFAULT_SETTINGS, USER_TYPE } from './helper.mjs';

// Helper function to get organization settings
 const getOrganizationSettings = async (organization_id, sortKey) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE_ORGANIZATION_SETTINGS || '',
        Key: { organization_id, settings: sortKey },
    };
    const command = new GetCommand(params);
    return await DynamoDB.send(command);
};

// Main handler function
export const getAllOrganisationSetting = async (event) => {
    const org_id = event.headers['org_id']; 
    const is_web = event.queryStringParameters?.is_web === 'true'; 
    const sortKey = is_web ? '0' : '1';

    try {
        // If org_id is not provided, return default settings
        if (!org_id) {
            return response(200, {
                org_name: 'Kindr',
                settings: DEFAULT_SETTINGS[sortKey].dropdowns,
                styles: DEFAULT_SETTINGS[sortKey].styles,
            });
        }

        // Get organization settings by organization ID and sort key
        const settingsResponse = await getOrganizationSettings(org_id, sortKey);
        console.log('Settings query response:', settingsResponse);

        if (!settingsResponse?.Item) {
            // If no settings are found, return default settings
            return response(200, {
                organization_id: org_id,
                settings: DEFAULT_SETTINGS[sortKey].dropdowns,
                styles: DEFAULT_SETTINGS[sortKey].styles,
            });
        }
        const dropDowns= { ...settingsResponse['Item.dropdowns'], USER_TYPE}

        return response(200, {
            organization_id: org_id,
            settings: dropDowns,
            styles: settingsResponse.Item.styles,
        });

    } catch (error) {
        console.error('Error fetching organization settings:', error.message);
        return response(500, `Error fetching organization settings: ${error.message}`);
    }
};
