import { UsersListResponse } from "@slack/web-api/dist/response/UsersListResponse";

export const slackUserMock: UsersListResponse =
  {
    ok: true,
    members: [
      { id: "123", real_name: "tester test" },
      { id: "4040", real_name: "Meta T" },
      { id: "124", real_name: "on vacation" }
    ]
  };

export const slackUserSpecialCharacterMock: UsersListResponse ={
  ok: true,
  members: [
    { id: "123", real_name: "Ñöä!£ Çøæé" }
  ]
};

export const slackUserErrorMock = {
  ok: false,
  error: "invalid_cursor"
};

export const slackPostMock = {
  ok: true
};

export const slackPostErrorMock = {
  ok: false,
  error: "too_many_attachments"
};