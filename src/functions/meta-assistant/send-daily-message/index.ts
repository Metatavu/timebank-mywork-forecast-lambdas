import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      schedule: "cron(15 6 ? * TUE-FRI *)"
    }
  ]
};