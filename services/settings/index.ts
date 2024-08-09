import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import {Context, Callback } from 'aws-lambda';
import { DynamoDB } from '../../database/connection';

export const getAllOrganisationSetting= async (event: any, context: Context, callback: Callback)=>{
  const { org_name } = event.pathParameters;

  try {
    const organizationParams = {
      TableName: process.env.DYNAMODB_TABLE_ORGANIZATIONS,
      KeyConditionExpression: 'org_name = :org_name',
      ExpressionAttributeValues: {
        ':org_name': org_name
      }
    };

    const command = new QueryCommand(organizationParams);
  
    const response = await DynamoDB.send(command);
    console.log('response',response)

    if (response?.Items?.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Organization not found' }),
      };
    }

    const organization_id =response?.Items && response?.Items[0]?.email;

    const settingsParams = {
      TableName: process.env.DYNAMODB_TABLE_ORGANIZATION_SETTINGS,
      Key: {
        organization_id: organization_id,
        settings: 'settings'
      }
    };

        const commands = new GetCommand(settingsParams);
        const settingsData=  await DynamoDB.send(commands);

    if (!settingsData?.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Settings not found for the organization' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        organization_name: org_name,
        settings: settingsData.Item.dropdowns,
        styles: settingsData.Item.styles
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching organization settings', error: error.message }),
    };
  }
}