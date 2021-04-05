import * as cdk from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as s3 from '@aws-cdk/aws-s3';
import { getAppEnv } from '../../config';

export class SendSmsFunctionCodebuildStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appEnv = getAppEnv();

    const bucket = s3.Bucket.fromBucketAttributes(this, 'FunctionsBucket', {
      bucketArn: cdk.Fn.importValue(`SampleInfraFunctionsBucketArn-${appEnv}`),
      bucketName: cdk.Fn.importValue(`SampleInfraFunctionsBucketName-${appEnv}`)
    });

    const project = new codebuild.Project(this, 'SendSmsCodebuildProject', {
      projectName: `${appEnv}-send-sms-lambda`,
      source: codebuild.Source.gitHub({
        owner: 'azmimengu',
        repo: 'sample-checkout-infra',
        branchOrRef: 'main',
      }),
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: [
              'echo "Changing working directory"',
              'cd lib/lambda/send-sms/function',
              'echo "Installing package dependencies..."',
              'npm install'
            ]
          },
          build: {
            commands: [
              'echo "Build started"',
              'npm run build',
            ],
          },
        },
        artifacts: {
          'base-directory': 'lib/lambda/send-sms/function/build',
          files: [
            '**/*'
          ],
          name: '$LAMBDA_VERSION'
        }
      }),
      artifacts: codebuild.Artifacts.s3({
        bucket,
        includeBuildId: false,
        packageZip: true,
        path: 'send-sms-function',
      }),
    });

  }
}
