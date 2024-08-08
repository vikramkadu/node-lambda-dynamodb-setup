import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import {  ReturnValue } from '@aws-sdk/client-dynamodb';
import {  PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDB } from '../../database/connection';
import { response } from '../../lib/responce';

export const registerUserHandler = async (event: APIGatewayEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> => {
    const { full_name, email, role_info, password } = JSON.parse(event.body || '{}');

    if (!full_name || !email || !role_info || !password) {
        return  response(400,'All fields are required')
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE_USERS || '',
        Item: {
            user_id: email, 
            full_name,
            email,
            role_info,
            password, 
        },
    };

    try {
        const command = new PutCommand(params);
      const res=  await DynamoDB.send(command);

      console.log(res)
        return response(201, 'User registered successfully' )
        
    } catch (error) {
        console.error('Error registering user:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};

export const editUserHandler = async (event: APIGatewayEvent, context: Context, callback: Callback): Promise<APIGatewayProxyResult> => {
    const userId = event.pathParameters?.id;
    const { full_name, role_info } = JSON.parse(event.body || '{}');

    if (!userId || !full_name || !role_info) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'All fields are required' }),
        };
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE_USERS || '',
        Key: { user_id: userId },
        UpdateExpression: 'set full_name = :full_name, role_info = :role_info',
        ExpressionAttributeValues: {
            ':full_name': full_name,
            ':role_info': role_info,
        },
        ReturnValues: ReturnValue.UPDATED_NEW,
    };

    try {
            const command = new UpdateCommand(params );

            const response = await DynamoDB.send(command);
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'User updated successfully', updatedAttributes: response.Attributes }),
            };
        
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' }),
        };
    }
};

