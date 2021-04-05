#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {
  getConfig,
  getAppEnv,
} from '../lib/config';
import { FunctionsBucketStack } from '../lib/s3/functions-bucket-stack';
import { CheckoutSuccessTopicStack } from '../lib/sns/checkout-success-topic-stack';
import { OrderCompletedEmailQueueStack } from '../lib/sqs/order-completed-email-queue-stack';
import { OrderCompletedSmsQueueStack } from '../lib/sqs/order-completed-sms-queue-stack';


const app = new cdk.App();
const appEnv = getAppEnv();
const conf = getConfig(app, appEnv);

const env = { account: conf.account, region: conf.region };

new FunctionsBucketStack(app, `FunctionsBucketStack-${appEnv}`, { env });
new CheckoutSuccessTopicStack(app, `CheckoutSuccessTopicStack-${appEnv}`, { env });
new OrderCompletedEmailQueueStack(app, `OrderCompletedEmailQueueStack-${appEnv}`, { env });
new OrderCompletedSmsQueueStack(app, `OrderCompletedSmsQueueStack-${appEnv}`, { env });
