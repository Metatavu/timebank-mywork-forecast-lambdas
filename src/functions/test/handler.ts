import { APIGatewayProxyHandler } from "aws-lambda";
import { middyfy } from "src/libs/lambda";
import mockData from '/home/aleksi-jurvanen/Asiakirjat/metatavu-HomeLambdas/home-lambdas/src/functions/test/mock-data.json'; 


const testFunctions: APIGatewayProxyHandler = async () => {
    // Extracting the user information from the event
    
    const userId = mockData.user_id;
    const userName = mockData.user_name;
    const userEmail = mockData.user_email;
    const userMessage = mockData.user_message;

    // Example processing (e.g., transforming the data)
    const processedData = {
        user_id: userId,
        user_name: userName.toUpperCase(),  // Convert the name to uppercase
        user_email: userEmail.toLowerCase(), // Ensure the email is lowercase
        user_message: userMessage  
    };

    // Return the processed data (useful for API response but not necessary for console logging)
    return {
        statusCode: 200,
        body: JSON.stringify(processedData)
    };
};

export const main = middyfy(testFunctions);