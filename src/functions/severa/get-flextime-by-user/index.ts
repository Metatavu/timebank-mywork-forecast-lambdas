import { handlerPath } from "@libs/handler-resolver";

export default {
	handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: "get",
        path: "/severa/{severaUserId}/flexTime",
        authorizer: {
          name: "timebankKeycloakAuthorizer"
        }
      },
    },
  ],
};