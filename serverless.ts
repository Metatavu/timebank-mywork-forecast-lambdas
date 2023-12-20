import type { AWS } from "@serverless/typescript";

import listDealsHandler from "@functions/pipedrive/list-deals";
import listLeadsHandler from "@functions/pipedrive/list-leads";
import getLeadByIdHandler from "@functions/pipedrive/find-lead-by-id";
import getDealByIdHandler from "@functions/pipedrive/find-deal-by-id";
import addInterestToDealHandler from "@functions/pipedrive/add-interest-to-deal"
import addInterestToLeadHandler from "@functions/pipedrive/add-interest-to-lead";
import removeInterestFromDealHandler from "@functions/pipedrive/remove-interest-from-deal";
import removeInterestFromLeadHandler from "@functions/pipedrive/remove-interest-from-lead";
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
  plugins: ['serverless-esbuild', 'serverless-deployment-bucket'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region: env.AWS_DEFAULT_REGION as any,
    deploymentBucket: {
      name: "${self:service}-${opt:stage}-deploy"
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    httpApi: {
      cors: true,
      authorizers: {
        "timebankKeycloakAuthorizer": {
          identitySource: "$request.header.Authorization",
          issuerUrl: env.AUTH_ISSUER,
          audience: ["account"]
        }
      }
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      FORECAST_API_KEY: env.FORECAST_API_KEY,
      AUTH_ISSUER: env.AUTH_ISSUER,
      PIPEDRIVE_API_KEY: env.PIPEDRIVE_API_KEY,
      PIPEDRIVE_API_URL: env.PIPEDRIVE_API_URL,
    },
  },
  functions: {
    listDealsHandler,
    listLeadsHandler,
    getLeadByIdHandler,
    getDealByIdHandler,
    addInterestToDealHandler,
    addInterestToLeadHandler,
    removeInterestFromDealHandler,
    removeInterestFromLeadHandler,
    listAllocationsHandler,
    listProjectsHandler,
    listTasksHandler,
    listTimeEntriesHandler,
    listProjectSprintsHandler
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
