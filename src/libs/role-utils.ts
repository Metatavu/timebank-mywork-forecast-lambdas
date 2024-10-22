import { APIGatewayProxyEvent } from 'aws-lambda';
import * as jwt from 'jsonwebtoken';

/**
 * Function to extract roles from the realm_access section of a JWT token.
 * @param event - The API Gateway event containing the headers.
 * @returns An array of roles from realm_access or null if no roles are found.
 */
export const getRolesFromToken = (event: { headers: APIGatewayProxyEvent['headers'] }): string[] | null => {
  try {
    const authHeader = event.headers.Authorization || event.headers.authorization;
    
    if (!authHeader) {
      console.error("Missing Authorization header.");
      return null;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      console.error("Authorization header does not contain a valid token.");
      return null;
    }

    const decodedToken = jwt.decode(token) as { realm_access?: { roles: string[] } } | null;

    if (!decodedToken) {
      console.error('Invalid token or unable to decode.');
      return null;
    }

    console.log('Decoded JWT Token:', JSON.stringify(decodedToken, null, 2));

    const realmRoles = decodedToken.realm_access?.roles || [];

    if (realmRoles.length === 0) {
      console.log('No roles found in realm_access.');
      return null;
    }

    return realmRoles;
  } catch (error) {
    console.error('Error extracting roles from token:', error);
    return null;
  }
};
