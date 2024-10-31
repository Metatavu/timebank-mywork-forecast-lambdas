import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/memos',
        authorizer: {
          name: "timebankKeycloakAuthorizer"
        }
      }
    }
  ],
}