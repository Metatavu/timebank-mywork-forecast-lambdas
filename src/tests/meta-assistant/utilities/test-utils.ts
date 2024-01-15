import { IncomingMessage } from "http";
import { Socket } from "net";
import TimeBankApiProvider from "src/meta-assistant/timebank/timebank-api";
import slackUtilities from "src/meta-assistant/slack/slack-utils";
import fetch from "node-fetch";
import { DailyMessageResult, WeeklyMessageResult } from "src/types/meta-assistant/index";
import { Member, UsersListResponse } from "@slack/web-api/dist/response/UsersListResponse";
import * as KeycloakMock from "keycloak-mock";

/**
 * Helper functions for testing suites.
 */
namespace TestHelpers {
  const personsClient = TimeBankApiProvider.personsClient;
  const dailyEntriesClient = TimeBankApiProvider.dailyEntriesClient;
  const slackUsersClient = slackUtilities.client;

  const { Response } = jest.requireActual("node-fetch");

  const mockedFetch = {
    fetch: fetch
  };

  /**
   * Creates Timebank API matching response
   *
   * @param status statusCode of response
   * @param body body of Response
   * @returns IncomingMessage
   */
  const createIncomingMessage = (status: number, body: any): any => {
    let message = new IncomingMessage(new Socket);
    message.statusCode = status;

    return {
      response: message,
      body: body
    };
  };

  /**
   * Creates Forecast API matching response
   *
   * @param status status of response
   * @param body body of response
   * @returns Response
   */
  const createResponse = (status: number, body: any): any => {
    return new Response(JSON.stringify(body), { status: status });
  };

  /**
   * Create mock Keycloak instance that intercepts requests to given authServerUrl
   *
   * @returns KeycloakMock.MockInstance
   */
  const mockKeycloak = async (): Promise<KeycloakMock.MockInstance> => {
    const keycloak = await KeycloakMock.createMockInstance({
      authServerURL: "http://localhost:8080",
      realm: "quarkus",
      clientID: "meta-assistant",
      clientSecret: "zoxruqJ6bBYptkJwewhu9bqmkgwxatzS"
    });
    const mock = KeycloakMock.activateMock(keycloak);
    keycloak.database.createUser({
      firstName: "test",
      email: "test@test.test",
      credentials: [{
        value: "password"
      }]
    });
    KeycloakMock.deactivateMock(mock);

    return keycloak;
  };

  /**
   * Mocks access token to access mock Timebank API through tests
   *
   * @returns access_token
   */
  export const mockAccessToken = async (): Promise<any> => {
    const keycloak = await mockKeycloak();
    const user = keycloak.database.allUsers();

    return new Response(JSON.stringify({ access_token: keycloak.createBearerToken(user[0].profile.id) }));
  };

  /**
   * Configures mock listDailyEntries response
   *
   * @param statusCode API response statusCode
   * @param body API response body
   */
  export const mockTimebankDailyEntries = (statusCode: number, body: any) => {
    const dailyEntriesSpy = jest.spyOn(dailyEntriesClient, "listDailyEntries");
    if (statusCode !== 200) {
      dailyEntriesSpy.mockReturnValueOnce(createIncomingMessage(statusCode, body));
    }
    for (let i = 0; i < body.length; i++) {
      dailyEntriesSpy.mockReturnValueOnce(createIncomingMessage(statusCode, body[i]));
    }
  };

  /**
   * Configures mock listPersons response
   *
   * @param statusCode API response statusCode
   * @param body API response body
   */
  export const mockTimebankPersons = (statusCode: number, body: any) => {
    jest.spyOn(personsClient, "listPersons")
      .mockReturnValueOnce(createIncomingMessage(statusCode, body));
  };

  /**
   * Configures mock listPersonTotalTime response
   *
   * @param statusCode API response statusCode
   * @param body API response body
   */
  export const mockTimebankPersonTotalTimes = (statusCode: number, body: any) => {
    const personTotalTimesSpy = jest.spyOn(personsClient, "listPersonTotalTime");
    for (let i = 0; i < body.length; i++) {
      personTotalTimesSpy.mockReturnValueOnce(createIncomingMessage(statusCode, body[i]));
    }
  };

  /**
   * Configures mock fetch to Forecast API to return given data.
   * Has to always return KeycloakMock access token first during handler tests.
   *
   * @param statusCode API response statusCode
   * @param body API response body
   * @param keycloakMock API response keyCloakMock
   */
  export const mockForecastResponse = (statusCode: number, body: any, keycloakMock: boolean) => {
    const fetchSpy = jest.spyOn(mockedFetch, "fetch");
    if (keycloakMock) {
      fetchSpy.mockReturnValueOnce(mockAccessToken());
    }
    if (statusCode !== 200) {
      fetchSpy.mockReturnValueOnce(createResponse(statusCode, body));
    }
    for (let i = 0; i < body.length; i++) {
      fetchSpy.mockReturnValueOnce(createResponse(statusCode, body[i]));
    }
  };

  /**
   * Configures mock list response
   *
   * @param mockData response mockData
   */
  export const mockSlackUsers = (mockData: UsersListResponse) => {
    jest.spyOn(slackUsersClient.users, "list").mockReturnValueOnce(Promise.resolve(mockData));
  };

  /**
   * Configures mock postMessage response
   *
   * @param mockData response mockData
   */
  export const mockSlackPostMessage = (mockData: UsersListResponse) => {
    jest.spyOn(slackUsersClient.chat, "postMessage").mockImplementation(() => Promise.resolve(mockData));
  };

  /**
   * Validates/tests that constructed daily message is correctly formatted etc.
   *
   * @param data user's data
   * @param slackUsers slack users
   */
  export const validateDailyMessage = (data: DailyMessageResult, slackUsers: Member[]) => {
    const {
      message,
      name,
      displayDate,
      billableHoursPercentage,
      displayExpected,
      displayInternal,
      displayLogged,
      displayBillableProject
    } = data.message;

    const slackNameMatches = slackUsers.find(user => user.real_name === name);
    const date = new Date(displayDate);

    expect(message).toBeDefined();
    expect(typeof message).toEqual(typeof "string");
    expect(name).toBeDefined();
    expect(displayDate).toBeDefined();
    expect(billableHoursPercentage).toBeDefined();
    expect(displayExpected).toBeDefined();
    expect(displayInternal).toBeDefined();
    expect(displayLogged).toBeDefined();
    expect(displayBillableProject).toBeDefined();
    expect(slackNameMatches).toBeDefined();
  };

  /**
   * Validates/tests that constructed weekly message is correctly formatted etc.
   *
   * @param data user's data
   * @param slackUsers slack users
   */
  export const validateWeeklyMessage = (data: WeeklyMessageResult, slackUsers: Member[]) => {
    const {
      message,
      name,
      endDate,
      startDate,
      week,
      billableHoursPercentage,
      displayExpected,
      displayInternal,
      displayLogged,
      displayBillableProject
    } = data.message;

    const slackNameMatches = slackUsers.find(user => user.real_name === name);

    expect(message).toBeDefined();
    expect(typeof message).toEqual(typeof "string");
    expect(name).toBeDefined();
    expect(endDate).toBeDefined();
    expect(startDate).toBeDefined();
    expect(week).toBeDefined();
    expect(billableHoursPercentage).toBeDefined();
    expect(displayExpected).toBeDefined();
    expect(displayInternal).toBeDefined();
    expect(displayLogged).toBeDefined();
    expect(displayBillableProject).toBeDefined();
    expect(slackNameMatches).toBeDefined();
  };
}

export default TestHelpers;