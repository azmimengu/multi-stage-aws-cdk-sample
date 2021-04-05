# Multi Account, Multi Stage and Event-Driven Sample Architecture building with AWS CDK
![AWS CDK, IaC, AWS Cloud](assets/architecture.png?raw=true "Sample Architecture")

You can pass *APP_ENV* environment variable to commands below to be able to synth & deploy for multi-stages in your related account.

You can configure your stages and account definitions inside `cdk.context.json` file located in root dir

Do not forget to change the CodeBuild Github source with your repository information. Once you need to have authorized your Github account with Codebuild before starting a build.

### S3 Bucket Deployment
* `cdk synth --app "npx ts-node bin/common.ts" FunctionsBucketStack-dev`
* `cdk deploy --app "npx ts-node bin/common.ts" FunctionsBucketStack-dev`

### SNS Deployment
* `cdk synth --app "npx ts-node bin/common.ts" CheckoutSuccessTopicStack-dev`
* `cdk deploy --app "npx ts-node bin/common.ts" CheckoutSuccessTopicStack-dev`

### SQS Deployment
Required stacks before deploy stacks `ALL` below:
> CheckoutSuccessTopicStack
* `cdk synth --app "npx ts-node bin/common.ts" OrderCompletedEmailQueueStack-dev`
* `cdk deploy --app "npx ts-node bin/common.ts" OrderCompletedEmailQueueStack-dev`

* `cdk synth --app "npx ts-node bin/common.ts" OrderCompletedSmsQueueStack-dev`
* `cdk deploy --app "npx ts-node bin/common.ts" OrderCompletedSmsQueueStack-dev`

## Codebuild stacks for all Lambda functions
Required stacks before deploy stacks `ALL` below:
> FunctionsBucketStack

* `cdk synth --app "npx ts-node bin/codebuild.ts" CheckoutFunctionCodebuildStack-dev`
* `cdk deploy --app "npx ts-node bin/codebuild.ts" CheckoutFunctionCodebuildStack-dev`

* `cdk synth --app "npx ts-node bin/codebuild.ts" CreateDeliveryCheckoutFunctionCodebuildStack-dev`
* `cdk deploy --app "npx ts-node bin/codebuild.ts" CreateDeliveryCheckoutFunctionCodebuildStack-dev`

* `cdk synth --app "npx ts-node bin/codebuild.ts" DiscountCheckerFunctionCodebuildStack-dev`
* `cdk deploy --app "npx ts-node bin/codebuild.ts" DiscountCheckerFunctionCodebuildStack-dev`

* `cdk synth --app "npx ts-node bin/codebuild.ts" SendSmsFunctionCodebuildStack-dev`
* `cdk deploy --app "npx ts-node bin/codebuild.ts" SendSmsFunctionCodebuildStack-dev`

* `cdk synth --app "npx ts-node bin/codebuild.ts" SendEmailFunctionCodebuildStack-dev`
* `cdk deploy --app "npx ts-node bin/codebuild.ts" SendEmailFunctionCodebuildStack-dev`

## Lambda Functions
Required stacks before deploy stacks below:
> CheckoutSuccessTopicStack
>> TAG value represents lambda source code artifact key name that stored inside S3. Please replace with your value.
* `TAG=1.0.0 cdk synth --app "npx ts-node bin/function.ts" CheckoutFunctionStack-dev`
* `TAG=1.0.0 cdk deploy --app "npx ts-node bin/function.ts" CheckoutFunctionStack-dev`

Required stacks before deploy stacks below:
> CheckoutSuccessTopicStack
* `TAG=1.0.0 cdk synth --app "npx ts-node bin/function.ts" CreateDeliveryFunctionStack-dev`
* `TAG=1.0.0 cdk deploy --app "npx ts-node bin/function.ts" CreateDeliveryFunctionStack-dev`

Required stacks before deploy stacks below:
> CheckoutSuccessTopicStack
* `TAG=1.0.0 cdk synth --app "npx ts-node bin/function.ts" DiscountCheckerFunctionStack-dev`
* `TAG=1.0.0 cdk deploy --app "npx ts-node bin/function.ts" DiscountCheckerFunctionStack-dev`

Required stacks before deploy stacks below:
> OrderCompletedEmailQueueStack
* `TAG=1.0.0 cdk synth --app "npx ts-node bin/function.ts" SendEmailFunctionStack-dev`
* `TAG=1.0.0 cdk deploy --app "npx ts-node bin/function.ts" SendEmailFunctionStack-dev`

Required stacks before deploy stacks below:
> OrderCompletedSmsQueueStack
* `TAG=1.0.0 cdk synth --app "npx ts-node bin/function.ts" SendSmsFunctionStack-dev`
* `TAG=1.0.0 cdk deploy --app "npx ts-node bin/function.ts" SendSmsFunctionStack-dev`


#### Example CodeBuild build commands for all Lambda Functions:
> Please authorize your Github repository on the CodeBuild dashboard before executing the commands below.
>> You can change LAMBDA_VERSION value on your CI/CD pipe that you love.

* `aws codebuild start-build --project-name dev-checkout-lambda --environment-variables-override "[{\"name\":\"LAMBDA_VERSION\",\"value\":\"1.0.3\"}]"`
* `aws codebuild start-build --project-name dev-create-delivery-lambda --environment-variables-override "[{\"name\":\"LAMBDA_VERSION\",\"value\":\"1.0.0\"}]"`
* `aws codebuild start-build --project-name dev-discount-checker-lambda --environment-variables-override "[{\"name\":\"LAMBDA_VERSION\",\"value\":\"1.0.0\"}]"`
* `aws codebuild start-build --project-name dev-send-sms-lambda --environment-variables-override "[{\"name\":\"LAMBDA_VERSION\",\"value\":\"1.0.0\"}]"`
* `aws codebuild start-build --project-name dev-send-email-lambda --environment-variables-override "[{\"name\":\"LAMBDA_VERSION\",\"value\":\"1.0.0\"}]"`

#### Sample Function Invoking 
* `aws lambda invoke --function-name prod-checkout-function --invocation-type Event --payload '{ "AWS": 'ome' }' response.json`

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run dev`    perform the jest unit devs
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
