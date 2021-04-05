import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import { getAppEnv } from '../config';

export class FunctionsBucketStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();

    const bucket = new s3.Bucket(this, 'FunctionsBucket', {
      bucketName: `${appEnv}-sample-infra-functions`
    });

    new cdk.CfnOutput(this, 'SampleInfraFunctionsBucketArn', {
      value: bucket.bucketArn,
      exportName: `SampleInfraFunctionsBucketArn-${appEnv}`,
      description: 'Sample infra functions bucket ARN',
    });

    new cdk.CfnOutput(this, 'SampleInfraFunctionsBucketName', {
      value: bucket.bucketName,
      exportName: `SampleInfraFunctionsBucketName-${appEnv}`,
      description: 'Sample infra functions bucket Name',
    });
    
  }
}
