import type { AWS } from "@serverless/typescript";

import listAllocationsHandler from "@functions/list-allocations";
import listProjectsHandler from "@functions/list-projects";
import listTasksHandler from "@functions/list-tasks";
import listTimeEntriesHandler from "@functions/list-time-entries";
import listProjectSprintsHandler from "@functions/list-project-sprints";

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import { env } from "process";

const serverlessConfiguration: AWS = {
  service: 'home-lambdas',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    httpApi: {
      cors: true,
      authorizers: {
        "timebankKeycloakAuthorizer": {
          identitySource: "${request.header.Authorization}",
          issuerUrl: env.TIMEBANK_KEYCLOAK_URL,
          audience: ["account"]
        }
      }
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: {
    listAllocationsHandler:{
      handler: listAllocationsHandler.handler,
      // Problem this is overriding the lambda handler index.ts as authorizer not accessible from there?
      events: [{
          httpApi: {
            method:"get",
            path:"/allocations",
            authorizer: {
              name: "timebankKeycloakAuthorizer"
            }
          }
        }]
    },
    listProjectsHandler: {
      handler: listProjectsHandler.handler,
      events: [{
          httpApi: {
            method:"get",
            path:"/projects",
            authorizer: {
              name: "timebankKeycloakAuthorizer"
            }
          }
        }]
    },
    listTasksHandler: {
      handler: listTasksHandler.handler,
      events: [{
          httpApi: {
            method:"get",
            path:"/tasks",
            authorizer: {
              name: "timebankKeycloakAuthorizer"
            }
          }
        }]
    },
    listTimeEntriesHandler: {
      handler: listTimeEntriesHandler.handler,
      events: [{
          httpApi: {
            method:"get",
            path:"/time-entries",
            authorizer: {
              name: "timebankKeycloakAuthorizer"
            }
          }
        }]
    },
    listProjectSprintsHandler: {
      handler: listProjectSprintsHandler.handler,
      events: [{
          httpApi: {
            method:"get",
            path:"/projects/{projectId}/sprints",
            authorizer: {
              name: "timebankKeycloakAuthorizer"
            }
          }
        }]
    }
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
