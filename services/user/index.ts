import { APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ReturnValue } from '@aws-sdk/client-dynamodb';
import { PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { response } from '../../lib/responce';
import { executeDynamoDBCommand } from '../../database/helper';
import { ADDED_SUCCESSFULLY, ORGANIZATIONS_ONBOARD_SUCCESSFULLY, REQUIRED_FIELDS, UPDATED_SUCCESSFULLY } from '../../lib/constants';

// Register User Handler
export const registerUserHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const { full_name, email, role_info } = JSON.parse(event.body || '{}');

    if (!full_name || !email || !role_info) {
        return response(400,REQUIRED_FIELDS);
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE_USERS || '',
        Item: { email, full_name, role_info },
    };

    const command = new PutCommand(params);
    return await executeDynamoDBCommand(command, ADDED_SUCCESSFULLY);
};

// Edit User Handler
export const editUserHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
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

// Onboard Organization Handler
export const onboardCreateHandler = async (event: APIGatewayEvent): Promise<APIGatewayProxyResult> => {
    const { org_name, primary_goals, geo_focus, sectors_aligned, email } = JSON.parse(event.body || '{}');
    if (!org_name || !primary_goals || !geo_focus || !sectors_aligned || !email) {
        return response(400,REQUIRED_FIELDS);
    }
    const params = {
        TableName: process.env.DYNAMODB_TABLE_ORGANIZATIONS || '',
        Item: { email, org_name, primary_goals, geo_focus, sectors_aligned },
    };
    const command = new PutCommand(params);
    return await executeDynamoDBCommand(command, ORGANIZATIONS_ONBOARD_SUCCESSFULLY);
};
