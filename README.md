# MongoStore - Simple e-commerce app

This code is used in the article "How To Find Bottlenecks in MongoDB: Profiling and Load Testing Strategies with JMeter".

The MongoDB setup in this project does not follow the best practices to be production-ready. Please, refer to the [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/).

## How to Deploy

First, deploy the infrastructure with the MongoDB Cluster. 

```
cd infra
cdk deploy
```

Then, deploy the serverless functions

```
cd services
sls deploy
```

Note: you can also run `yarn deploy:staging`. If you are using node version 16 locally, you might run into an error where AWS says the zip file is empty. If that happens, downgrade to node 14.
## How to Destroy

To save resources in your AWS account, destroy the CDK stack and the lambda functions.

```
sls remove
cdk destroy
```

## How to Run

To create the seed data, make a POST request to the seed endpoint. Substitute the URL below for the one returned after the deploy.

```
curl -X POST https://npf06fvm8f.execute-api.us-east-1.amazonaws.com/staging/seed -d {}
```

Fetch the available regions:

```
curl https://npf06fvm8f.execute-api.us-east-1.amazonaws.com/staging/regions
```

Request the available products for that region by passing the region id in the URL.


```
curl https://npf06fvm8f.execute-api.us-east-1.amazonaws.com/staging/regions/<region_id>/products?limit=2
```

## Infra

The infra directory uses AWS CDK and creates a MongoDB Cluster with 3 EC2 instances with a single deploy command. 

The `cdk.json` file tells the CDK Toolkit how to execute your app.

### Accessing the EC2 Instances

If you want to access the MongoDB Instance in EC2, go to the console and get the public ip address.
Then, SSH into it using your ec2-key-pair.

```
ssh -i ~/.ssh/aws-ec2-key-pair.pem ec2-user@<public-ip>
```

### Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk destroy`      destroy the stack
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## Services

The services directory is a serverless application that connects to the MongoDB Cluster and provides functions for our e-commerce app.

### Useful commands

* `sls deploy`  deploys the service to AWS
* `sls remove`  destroy the stack  
* `yarn test:watch` runs jest in watch mode
