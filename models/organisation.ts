import { DescribeTableCommand, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDB } from "../database/connection";

const checkAndCreateOrgTable = async (tableName:any) => {
    try {
        const describeTableCommand = new DescribeTableCommand({ TableName: tableName });
        await DynamoDB.send(describeTableCommand);
        console.log(`Table "${tableName}" already exists.`);
    } catch (error: any) {
        if (error.name === "ResourceNotFoundException") {
            const params = {
                TableName: tableName,
                AttributeDefinitions: [
                    { AttributeName: "email", AttributeType: "S" },
                ],
                KeySchema: [
                    { AttributeName: "email", KeyType: "HASH" },
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 5,
                    WriteCapacityUnits: 5,
                },
            };

            const createTableCommand = new CreateTableCommand(params);
            await DynamoDB.send(createTableCommand);
            console.log(`Table "${tableName}" created successfully.`);
        } else {
            throw new Error(`Unable to describe or create table: ${error.message}`);
        }
    }
};

export { checkAndCreateOrgTable };
