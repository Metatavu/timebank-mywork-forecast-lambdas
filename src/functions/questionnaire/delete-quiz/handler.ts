import type { APIGatewayProxyHandler } from "aws-lambda";
export const deleteQuizHandler: APIGatewayProxyHandler = async (event) => {
    try {
        console.log("Received event:", event);
        if (!event.body) {
            throw new Error("Request body is missing");
        }
        const { id } = JSON.parse(event.body);
        if (!id) {
            throw new Error("Missing required fields in the input JSON");
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `id:${id} deleted successfully!`
            })
        };
    } catch (error) {
        console.error("Error processing request:", error);
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Invalid JSON input",
                error: error.message,
            })
        };
    }
};
