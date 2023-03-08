# Creating a MongoDB Cluster in AWS

This project has the goal of creating a MongoDB Cluster in AWS with a single deploy command. This code is going to be used in an article to talk about the problems with O(N^2) algorithms in production systems and how to load test APIs with jMeter.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy --profile personal`      deploy this stack to your default AWS account/region
* `cdk destroy --profile personal`      destroy the stack
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
