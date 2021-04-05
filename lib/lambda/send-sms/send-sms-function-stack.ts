import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';
import * as sqs from '@aws-cdk/aws-sqs';
import * as eventSource from '@aws-cdk/aws-lambda-event-sources';
import { getAppEnv } from '../../config';

export class SendSmsFunctionStack extends cdk.Stack {

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
    
    const sendSmsFunction = new lambda.Function(this, 'SendSmsFunction', {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromBucket(bucket, `send-sms-function/${lambdaTag}`),
      handler: 'index.handler',
      functionName: `${appEnv}-send-sms-function`,
      currentVersionOptions: {
        removalPolicy: cdk.RemovalPolicy.RETAIN,
      },
      description: `deployed at ${new Date()}`
    });

    const lambdaVersion = new lambda.Alias(this, 'lambdaAlias', {
      aliasName: 'sample-alias',
      version: sendSmsFunction.currentVersion,
    });
    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnVersion).cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;
    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnVersion).cfnOptions.updateReplacePolicy = cdk.CfnDeletionPolicy.RETAIN;

    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnAlias).cfnOptions.deletionPolicy = cdk.CfnDeletionPolicy.RETAIN;
    (lambdaVersion.node.tryFindChild('Resource') as lambda.CfnAlias).cfnOptions.updateReplacePolicy = cdk.CfnDeletionPolicy.RETAIN;

    const orderCompletedQueue = sqs.Queue.fromQueueAttributes(this, 'OrderCompletedSmsQueue', {
      queueArn: cdk.Fn.importValue(`OrderCompletedSmsQueueArn-${appEnv}`),
      queueName: cdk.Fn.importValue(`OrderCompletedSmsQueueName-${appEnv}`)
    });

    const event = new eventSource.SqsEventSource(orderCompletedQueue);
    sendSmsFunction.addEventSource(event);

  }

}
