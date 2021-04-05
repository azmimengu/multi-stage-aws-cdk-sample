import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as iam from '@aws-cdk/aws-iam';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions'
import {
  getConfig,
  getAppEnv,
} from '../config';

export class OrderCompletedSmsQueueStack extends cdk.Stack {

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();
    const conf = getConfig(scope, appEnv);

    const queue = new sqs.Queue(this, 'OrderCompletedSmsQueue', {
      queueName: `${appEnv}-order-completed-sms-queue`,
    });

    const orderCompletedTopic = sns.Topic.fromTopicArn(this, 'OrderCompletedTopic', cdk.Fn.importValue(`CheckoutSuccessTopicArn-${appEnv}`));

    const orderCompletedQueueSubscription = new subscriptions.SqsSubscription(queue);
    orderCompletedTopic.addSubscription(orderCompletedQueueSubscription);

    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [ new iam.ServicePrincipal('sns.amazonaws.com') ],
      actions: [
        'sqs:SendMessage'
      ],
      resources: [
        `${queue.queueArn}:${conf.region}:${conf.account}:${queue.queueName}`
      ],
      conditions: {
        'ArnEquals': { 'aws:SourceArn': cdk.Fn.importValue(`CheckoutSuccessTopicArn-${appEnv}`) }
      }
    });

    queue.addToResourcePolicy(policy);

    new cdk.CfnOutput(this, 'OrderCompletedSmsQueueArn', {
      value: queue.queueArn,
      exportName: `OrderCompletedSmsQueueArn-${appEnv}`,
      description: 'Order completed sms queue ARN',
    });

    new cdk.CfnOutput(this, 'OrderCompletedSmsQueueName', {
      value: queue.queueName,
      exportName: `OrderCompletedSmsQueueName-${appEnv}`,
      description: 'Order completed sms queue Name',
    });

    new cdk.CfnOutput(this, 'OrderCompletedSmsQueueUrl', {
      value: queue.queueUrl,
      exportName: `OrderCompletedSmsQueueUrl-${appEnv}`,
      description: 'Order completed sms queue URL',
    });

  }

}