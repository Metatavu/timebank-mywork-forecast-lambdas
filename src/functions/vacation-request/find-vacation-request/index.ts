import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: "get",
        path: "/vacationRequests/{id}",
        authorizer: {
          name: "timebankKeycloakAuthorizer",
        }
      }
    }
  ]
}