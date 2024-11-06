import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      httpApi: {
        method: 'head',
        path: '/trello/send-memo-notification'
      }
    }
  ],
}