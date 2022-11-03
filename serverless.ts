import type { AWS } from '@serverless/typescript';

import listAllocations from '@functions/list-allocations';
import listProjects from '@functions/list-projects';
import listTasks from '@functions/list-tasks';
import listTimeEntries from '@functions/list-time-entries';
import listProjectSprints from '@functions/list-project-sprints';

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const serverlessConfiguration: AWS = {
  service: 'timebank-lambdas',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: {
    listAllocations,
    listProjects,
    listTasks,
    listTimeEntries,
    listProjectSprints
  },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
