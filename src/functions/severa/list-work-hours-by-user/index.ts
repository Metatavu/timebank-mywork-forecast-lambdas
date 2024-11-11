import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: "get",
        path: "/severa/users/{severaUserGuid}/workhours",
        authorizer: {
          name: "timebankKeycloakAuthorizer"
        }
      },
    },
  ],
};