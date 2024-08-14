import { DynamoDB } from "./connection.mjs";
import { response } from '../lib/responce.mjs';

// Helper function to handle DynamoDB commands
export const executeDynamoDBCommand = async (command, successMessage) => {
    try {
        const res = await DynamoDB.send(command);
        console.log(res);
        return response(200, successMessage);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return response(500, 'Internal Server Error');
    }
};