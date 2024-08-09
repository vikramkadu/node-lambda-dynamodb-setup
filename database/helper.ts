import { DynamoDB } from "./connection";
import { response } from '../lib/responce';

// Helper function to handle DynamoDB commands
export const executeDynamoDBCommand = async (command: any, successMessage: string) => {
    try {
        const res = await DynamoDB.send(command);
        console.log(res);
        return response(200, successMessage);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return response(500, 'Internal Server Error');
    }
};