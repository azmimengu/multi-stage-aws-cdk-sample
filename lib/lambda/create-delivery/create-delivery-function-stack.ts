import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as eventSource from '@aws-cdk/aws-lambda-event-sources';
import * as sns from '@aws-cdk/aws-sns';
import { getAppEnv } from '../../config';

export class CreateDeliveryFunctionStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();
    const lambdaTag = process.env.TAG;

    if (!lambdaTag) {
      throw new Error('Must be supply lambda TAG variable to deploy function.');
    }

    const bucket = s3.Bucket.fromBucketAttributes(this, 'FunctionsBucket', {
      bucketArn: cdk.Fn.importValue(`SampleInfraFunctionsBucketArn-${appEnv}`),
      bucketName: cdk.Fn.importValue(`SampleInfraFunctionsBucketName-${appEnv}`)
    });
    
    const createDeliveryFunction = new lambda.Function(this, 'CreateDeliveryFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromBucket(bucket, `create-delivery-function/${lambdaTag}`),
      handler: 'index.handler',
      functionName: `${appEnv}-create-delivery-function`,
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
      description: `deployed at ${new Date()}`
    });

    const lambdaVersion = new lambda.Alias(this, 'lambdaAlias', {
      aliasName: 'sample-alias',
      version: createDeliveryFunction.currentVersion,
    });
    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnVersion).cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;
    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnVersion).cfnOptions.updateReplacePolicy = cdk.CfnDeletionPolicy.RETAIN;

    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnAlias).cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;
    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnAlias).cfnOptions.updateReplacePolicy = cdk.CfnDeletionPolicy.RETAIN;

    const checkoutSuccessTopic = sns.Topic.fromTopicArn(this, 'CheckoutSuccessTopic', cdk.Fn.importValue(`CheckoutSuccessTopicArn-${appEnv}`));
    const event = new eventSource.SnsEventSource(checkoutSuccessTopic);
    createDeliveryFunction.addEventSource(event);

  }

}
