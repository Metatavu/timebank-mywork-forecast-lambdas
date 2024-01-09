import schema from "src/types/meta-assistant/index";
import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "post",
        path: "sendSlack",
        request: {
          schemas: {
            "application/json": schema
          }
        }
      }
    },
    {
      schedule: "cron(15 6 ? * MON-FRI *)"
    }
  ]
};