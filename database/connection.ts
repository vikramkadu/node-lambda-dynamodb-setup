import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import Config from "../config";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const config: DynamoDBClientConfig = {
  region: Config.region!,
  credentials: {
    accessKeyId: Config.accessKeyId!,
    secretAccessKey: Config.secretAccessKey!,
  }
};

const client = new DynamoDBClient(config);
export const DynamoDB = DynamoDBDocumentClient.from(client);
