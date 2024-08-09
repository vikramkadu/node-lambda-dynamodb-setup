import { APIGatewayProxyHandler, APIGatewayProxyResult, APIGatewayProxyEvent } from 'aws-lambda';
import { cognitoMiddleware } from './authMiddleware';

type AuthHandler = (event: APIGatewayProxyEvent, userId: string) => Promise<APIGatewayProxyResult>;

export const withAuth = (handler: AuthHandler): APIGatewayProxyHandler => {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const authResponse = await cognitoMiddleware(event);

    if (!authResponse.isAuthorized) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    return handler(event, authResponse.userId as string);
  };
};
