'use strict';
import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { executeDynamoDBCommand } from '../../database/helper.mjs';
import { ADDED_SUCCESSFULLY, ORGANIZATIONS_ONBOARD_SUCCESSFULLY, REQUIRED_FIELDS, UPDATED_SUCCESSFULLY } from '../../lib/constants.mjs';
import { response } from '../../lib/responce.mjs';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid'; 
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION });

// Register User Handler
export const registerUserHandler = async (event)=> {
    const { org_id=0, full_name, email, role_info } = JSON.parse(event.body || '{}');

    if (!full_name || !email || !role_info) {
        return response(400,REQUIRED_FIELDS);
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE_USERS || '',
        Item: { org_id, email, full_name, role_info },
    };

    const command = new PutCommand(params);
    return await executeDynamoDBCommand(command, ADDED_SUCCESSFULLY);
};

// Cognito signup
export const cognitoSignUpHandler = async (event) => {
    const { password, email } = JSON.parse(event.body || '{}');

    // Check required fields
    if (!password || !email) {
        return response(400, 'Missing required fields: email and password');
    }

    // Parameters for SignUpCommand
    const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        Password: password,
    };

    try {
        // Execute the SignUpCommand
        const command = new SignUpCommand(params);
        const result = await cognitoClient.send(command);

        // Return success response
        return response(200, {
            message: 'User signed up successfully',
            userSub: result.UserSub,
            codeDeliveryDetails: result.CodeDeliveryDetails,
        });
    } catch (error) {
        console.error('Error during Cognito signup:', error);
        return response(500, { message: 'Internal Server Error', error: error.message });
    }
};

// Confirm User Handler
export const confirmUserHandler = async (event) => {
    const { email, confirmationCode } = JSON.parse(event.body || '{}');

    // Check required fields
    if (!email || !confirmationCode) {
        return response(400, 'Missing required fields: email and confirmationCode');
    }

    // Parameters for ConfirmSignUpCommand
    const params = {
        ClientId: process.env.COGNITO_CLIENT_ID,
        Username: email,
        ConfirmationCode: confirmationCode,
    };

    try {
        // Execute the ConfirmSignUpCommand
        const command = new ConfirmSignUpCommand(params);
        const result = await cognitoClient.send(command);

        // Return success response
        return response(200, {
            message: 'User confirmed successfully',
        });
    } catch (error) {
        console.error('Error during user confirmation:', error);
        return response(500, { message: 'Internal Server Error', error: error.message });
    }
};

// Edit User Handler
export const editUserHandler = async (event)=> {
    const userId = event.pathParameters?.id;
    const { full_name, role_info } = JSON.parse(event.body || '{}');

    if (!userId || !full_name || !role_info) {
        return response(400, REQUIRED_FIELDS);
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE_USERS || '',
        Key: { user_id: userId },
        UpdateExpression: 'set full_name = :full_name, role_info = :role_info',
        ExpressionAttributeValues: { ':full_name': full_name, ':role_info': role_info },
        ReturnValues: ReturnValue.UPDATED_NEW,
    };
    const command = new UpdateCommand(params);
    return await executeDynamoDBCommand(command, UPDATED_SUCCESSFULLY);
};

//get Onboard Json example
export const  getOnboardSettings=async (event)=>{
    const role_type = event.pathParameters?.role_type;
    try{
        if (!role_type) {
            return response(400, 'Role type is required');
        }
        const filePath = path.join(__dirname,'..', '..', 'lib', 'json', `onboarding_${role_type}.json`);

        console.log(filePath)

        try {
            const fileContent = await fs.readFile(filePath, 'utf8');
            const settings = JSON.parse(fileContent);
            return response(200, settings);
        } catch (error) {
            console.error('Error reading settings file:', error.message);
            return response(404, `Settings file not found for role type: ${role_type}`);
        }
    } catch (error) {
        console.error('Error fetching onboard settings:', error.message);
        return response(500, `Error fetching onboard settings: ${error.message}`);
    }


}

// Onboard Organization Handler
export const onboardCreateHandler = async (event) => {
    // Parse the event body, using an empty object as a fallback
    const { org_name, primary_goals, geo_focus, sectors_aligned, org_id: providedOrgId } = JSON.parse(event.body || '{}');

    if (!org_name || !primary_goals || !geo_focus || !sectors_aligned) {
        return response(400, REQUIRED_FIELDS);
    }
    const org_id = providedOrgId || uuidv4();

    const params = {
        TableName: process.env.DYNAMODB_TABLE_ORGANIZATIONS || '',
        Item: { 
            org_id, 
            org_name, 
            primary_goals, 
            geo_focus, 
            sectors_aligned 
        },
    };

    // Create a new PutCommand with the specified parameters
    const command = new PutCommand(params);

    try {
        await executeDynamoDBCommand(command);
        
        // Return the created item as a response
        return response(200, {
            message: 'Organization onboarded successfully',
            organization: {
                org_id,
                org_name,
                primary_goals,
                geo_focus,
                sectors_aligned
            }
        });
    } catch (error) {
        // Handle any errors that occurred during the execution
        console.error('Error onboarding organization:', error);
        return response(500, 'An error occurred while onboarding the organization.');
    }
};
