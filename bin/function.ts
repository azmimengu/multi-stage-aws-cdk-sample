#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {
  getConfig,
  getAppEnv,
} from '../lib/config';
import { CheckoutFunctionStack } from '../lib/lambda/checkout';
import { CreateDeliveryFunctionStack } from '../lib/lambda/create-delivery';
import { DiscountCheckerFunctionStack } from '../lib/lambda/discount-checker';
import { SendEmailFunctionStack } from '../lib/lambda/send-email';
import { SendSmsFunctionStack } from '../lib/lambda/send-sms/send-sms-function-stack';

const app = new cdk.App();
const appEnv = getAppEnv();
const conf = getConfig(app, appEnv);

const env = { account: conf.account, region: conf.region };

new CheckoutFunctionStack(app, `CheckoutFunctionStack-${appEnv}`, { env });
new CreateDeliveryFunctionStack(app, `CreateDeliveryFunctionStack-${appEnv}`, { env });
new DiscountCheckerFunctionStack(app, `DiscountCheckerFunctionStack-${appEnv}`, { env });
new SendEmailFunctionStack(app, `SendEmailFunctionStack-${appEnv}`, { env });
new SendSmsFunctionStack(app, `SendSmsFunctionStack-${appEnv}`, { env });
