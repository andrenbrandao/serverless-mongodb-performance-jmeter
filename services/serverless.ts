/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';

import { hello, seed, getProducts, getProductsByRegion } from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'serverless-mongodb-performance',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      packager: 'yarn',
    },
    stage: '${opt:stage, self:provider.stage}',
    stages: ['staging', 'production'],
    prune: {
      automatic: true,
      number: 3,
    },
    alerts: {
      dashboards: true,
      definitions: {
        '5XXErrors': {
          name: '5XXErrors',
          namespace: 'AWS/ApiGateway',
          metric: '5XXError',
          omitDefaultDimension: true,
          dimensions: [
            {
              Name: 'ApiName',
              Value: '${self:service}-${self:custom.stage}',
            },
            {
              Name: 'Stage',
              Value: '${self:custom.stage}',
            },
          ],
          threshold: 5,
          statistic: 'Sum',
          period: 60,
          evaluationPeriods: 1,
          datapointsToAlarm: 1,
          comparisonOperator: 'GreaterThanOrEqualToThreshold',
        },
      },
      alarms: ['functionThrottles', 'functionErrors', '5XXErrors'],
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-offline',
    'serverless-stage-manager',
    'serverless-prune-plugin',
    'serverless-plugin-aws-alerts',
  ],
  provider: {
    name: 'aws',
    stage: "${opt:stage, 'staging'}",
    vpc: {
      securityGroupIds: [{ 'Fn::ImportValue': 'lambda-security-group-id' }],
      subnetIds: [{ 'Fn::ImportValue': 'vpc-public-subnet-id' }],
    },
    runtime: 'nodejs14.x',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['codedeploy:*'],
        Resource: '*',
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      metrics: false, // activate to see CacheHits and Misses
    },
    logs: {
      // activate to see API Gateway logs
      restApi: {
        accessLogging: false,
        executionLogging: false,
        level: 'INFO',
        fullExecutionData: false,
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { hello, seed, getProducts, getProductsByRegion },
};

module.exports = serverlessConfiguration;
