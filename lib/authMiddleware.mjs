import * as jwt from 'jsonwebtoken';

export const cognitoMiddleware = async (event)=> {
  const token = event.headers.Authorization || event.headers.authorization;

  if (!token) {
    return {
      isAuthorized: false,
    };
  }

  try {
    // Get the Cognito issuer URL from the token
    const decoded  = jwt.decode(token, { complete: true });
    if (!decoded || typeof decoded === 'string') {
      return { isAuthorized: false };
    }
    let issuer=''
    if (typeof decoded !== 'string') {
     issuer  = decoded.payload.iss;
    }

    // Verify the token with Cognito's public keys
    const jwtOptions  = {
      algorithms: ['RS256'],
      issuer,
    };

    const verified = jwt.verify(token, process.env.COGNITO_PUBLIC_KEY || '', jwtOptions);

    return {
      isAuthorized: true,
      userId: (verified ).sub, 
    };
  } catch (err) {
    console.error('Token verification failed:', err);
    return {
      isAuthorized: false,
    };
  }
};
