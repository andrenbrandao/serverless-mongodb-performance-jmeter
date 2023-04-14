# MongoStore - Simple e-commerce app

This code is used in the article "How to Fix Performance Bottlenecks in MongoDB with JMeter".

## Infra

The infra directory uses AWS CDK and creates a MongoDB Cluster with 3 EC2 instances with a single deploy command. 

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk destroy`      destroy the stack
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Services

The services directory is a serverless application that connects to the MongoDB Cluster and provides functions for our e-commerce app.

## Useful commands

* `sls deploy`  deploys the service to AWS
* `sls remove`  destroy the stack  
* `yarn test:watch` runs jest in watch mode
