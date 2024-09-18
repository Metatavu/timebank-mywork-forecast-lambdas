import { APIGatewayProxyEvent } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';

/**
 * Helper function to get the user's sub (user ID) from the Authorization header.
 * @param event - The API Gateway event containing the headers.
 * @returns The sub claim (user ID).
 */
export const getUserIdFromToken = (event: { headers: APIGatewayProxyEvent['headers'] }): string | null => {
  try {
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader) {
      console.log('Missing Authorization header.');
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.decode(token);

    if (!decodedToken || typeof decodedToken === 'string') {
      console.log('Invalid token.');
      return null;
    }

    console.log('Decoded JWT Token:', decodedToken);

    return decodedToken.sub;
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};
