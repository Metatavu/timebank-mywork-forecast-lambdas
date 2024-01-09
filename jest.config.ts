module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "tests/(.*)": "<rootDir>/__tests__/$1",
    "^axios$": "axios/dist/node/axios.cjs"
  },
  coveragePathIgnorePatterns: [
    "src/generated/*",
    "src/tests/*",
    "src/libs/*"
  ],
}

import type {Config} from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
  verbose: true,
};
// Or async function
export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
  };
};