import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions'
import * as sqs from '@aws-cdk/aws-sqs';
import { getAppEnv } from '../config';

export class CheckoutSuccessTopicStack extends cdk.Stack {

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();

    const topic = new sns.Topic(this, 'CheckoutSuccessTopic', {
      topicName: `${appEnv}-checkout-success-topic`,
      displayName: `Order checkout success topic`,
    });

    new cdk.CfnOutput(this, 'CheckoutSuccessTopicArn', {
      value: topic.topicArn,
      exportName: `CheckoutSuccessTopicArn-${appEnv}`,
      description: 'Order checkout success topic ARN'
    });

    new cdk.CfnOutput(this, 'CheckoutSuccessTopicName', {
      value: topic.topicName,
      exportName: `CheckoutSuccessTopicName-${appEnv}`,
      description: 'Order checkout success topic Name'
    });

  }

}