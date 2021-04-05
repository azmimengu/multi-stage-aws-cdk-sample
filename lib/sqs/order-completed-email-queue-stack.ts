import * as cdk from '@aws-cdk/core';
import * as sns from '@aws-cdk/aws-sns';
import * as sqs from '@aws-cdk/aws-sqs';
import * as iam from '@aws-cdk/aws-iam';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions'
import {
  getAppEnv,
  getConfig,
} from '../config';

export class OrderCompletedEmailQueueStack extends cdk.Stack {

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();
    const conf = getConfig(scope, appEnv);

    const queue = new sqs.Queue(this, 'OrderCompletedEmailQueue', {
      queueName: `${appEnv}-order-completed-email-queue`,
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

    new cdk.CfnOutput(this, 'OrderCompletedEmailQueueArn', {
      value: queue.queueArn,
      exportName: `OrderCompletedEmailQueueArn-${appEnv}`,
      description: 'Order completed email queue ARN',
    });

    new cdk.CfnOutput(this, 'OrderCompletedEmailQueueName', {
      value: queue.queueName,
      exportName: `OrderCompletedEmailQueueName-${appEnv}`,
      description: 'Order completed email queue Name',
    });

    new cdk.CfnOutput(this, 'OrderCompletedEmailQueueUrl', {
      value: queue.queueUrl,
      exportName: `OrderCompletedEmailQueueUrl-${appEnv}`,
      description: 'Order completed email queue URL',
    });

  }

}