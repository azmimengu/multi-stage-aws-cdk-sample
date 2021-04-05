#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {
  getConfig,
  getAppEnv,
} from '../lib/config';
import { CheckoutFunctionCodebuildStack } from '../lib/lambda/checkout';
import { CreateDeliveryCheckoutFunctionCodebuildStack } from '../lib/lambda/create-delivery';
import { DiscountCheckerFunctionCodebuildStack } from '../lib/lambda/discount-checker';
import { SendSmsFunctionCodebuildStack } from '../lib/lambda/send-sms/send-sms-function-codebuild-stack';
import { SendEmailFunctionCodebuildStack } from '../lib/lambda/send-email';

const app = new cdk.App();
const appEnv = getAppEnv();
const conf = getConfig(app, appEnv);

const env = { account: conf.account, region: conf.region };

new CheckoutFunctionCodebuildStack(app, `CheckoutFunctionCodebuildStack-${appEnv}`, { env });
new CreateDeliveryCheckoutFunctionCodebuildStack(app, `CreateDeliveryCheckoutFunctionCodebuildStack-${appEnv}`, { env });
new DiscountCheckerFunctionCodebuildStack(app, `DiscountCheckerFunctionCodebuildStack-${appEnv}`, { env });
new SendSmsFunctionCodebuildStack(app, `SendSmsFunctionCodebuildStack-${appEnv}`, { env });
new SendEmailFunctionCodebuildStack(app, `SendEmailFunctionCodebuildStack-${appEnv}`, { env });
