import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { readFileSync } from 'fs';

export class AwsCdkMongodbPerformanceStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'mongodb-vpc', {
      cidr: '10.0.0.0/16',
      natGateways: 0,
      subnetConfiguration: [
        { name: 'public', cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC },
      ]
    })

    const mongoSG = new ec2.SecurityGroup(this, 'mongoserver-sg', {
      vpc,
      allowAllOutbound: true,
    });

    mongoSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      'allow SSH access from anywhere',
    );

    mongoSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(27017),
      'allow connection to MongoDB',
    );

    // Create three instances
    const userDataPath = './lib/user-data.sh'
    const mainInstanceDataPath = './lib/main-instance-user-data.sh'

    const primaryNode = this.createEc2Instance({ name: 'mongodb0', securityGroup: mongoSG, vpc: vpc, privateIpAddress: '10.0.0.100', userDataPath: mainInstanceDataPath })
    const secondaryNode1 = this.createEc2Instance({ name: 'mongodb1', securityGroup: mongoSG, vpc: vpc, privateIpAddress: '10.0.0.101', userDataPath })
    const secondaryNode2 = this.createEc2Instance({ name: 'mongodb2', securityGroup: mongoSG, vpc: vpc, privateIpAddress: '10.0.0.102', userDataPath })

    new CfnOutput(this, 'PrimaryPublicIP', {value: primaryNode.instancePublicIp, description: 'MongoDB Primary node public ip', exportName: 'mongodb-primary-public-ip'})
    new CfnOutput(this, 'Secondary1PublicIP', {value: secondaryNode1.instancePublicIp, description: 'MongoDB Secondary1 node public ip', exportName: 'mongodb-secondary1-public-ip'})
    new CfnOutput(this, 'Secondary2PublicIP', {value: secondaryNode2.instancePublicIp, description: 'MongoDB Secondary2 node public ip', exportName: 'mongodb-secondary2-public-ip'})
  }

  createEc2Instance({ name, securityGroup, vpc, privateIpAddress, userDataPath }: { name: string, securityGroup: ec2.SecurityGroup, vpc: ec2.Vpc, privateIpAddress: string, userDataPath: string }) {
    const ec2Instance = new ec2.Instance(this, name, {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      securityGroup: securityGroup,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: 'aws-ec2-key-pair',
      privateIpAddress,
    });

    const userDataScript = readFileSync(userDataPath, 'utf8');
    ec2Instance.addUserData(userDataScript);

    return ec2Instance
  }
}
