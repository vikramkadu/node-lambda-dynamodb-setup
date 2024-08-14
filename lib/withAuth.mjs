import { cognitoMiddleware } from './authMiddleware.mjs';

export const withAuth = (handler) => {
  return async (event) => {
    const authResponse = await cognitoMiddleware(event);

    if (!authResponse.isAuthorized) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Unauthorized' }),
      };
    }

    return handler(event, authResponse.userId );
  };
};
