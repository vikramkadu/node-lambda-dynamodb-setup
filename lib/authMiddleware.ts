import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';

interface AuthResponse {
  isAuthorized: boolean;
  userId?: string;
}

export const cognitoMiddleware = async (
  event: APIGatewayProxyEvent
): Promise<AuthResponse> => {
  const token = event.headers.Authorization || event.headers.authorization;

  if (!token) {
    return {
      isAuthorized: false,
    };
  }

  try {
    // Get the Cognito issuer URL from the token
    const decoded :any = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string') {
      return { isAuthorized: false };
    }
    let issuer=''
    if (typeof decoded !== 'string') {
     issuer  = decoded.payload.iss;
    }

    // Verify the token with Cognito's public keys
    const jwtOptions :any = {
      algorithms: ['RS256'],
      issuer,
    };

    const verified = jwt.verify(token, process.env.COGNITO_PUBLIC_KEY || '', jwtOptions);

    return {
      isAuthorized: true,
      userId: (verified as any).sub, 
    };
  } catch (err) {
    console.error('Token verification failed:', err);
    return {
      isAuthorized: false,
    };
  }
};
