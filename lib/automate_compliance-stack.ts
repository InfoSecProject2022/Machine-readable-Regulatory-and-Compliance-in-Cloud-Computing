import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as logs from '@aws-cdk/aws-logs';
import s3 = require("@aws-cdk/aws-s3");
import * as cloudtrail from '@aws-cdk/aws-cloudtrail';
import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import * as iam from "@aws-cdk/aws-iam";
import * as lambda from "@aws-cdk/aws-lambda";
import path = require('path');
import eventes = require("@aws-cdk/aws-events");
import * as targets from "@aws-cdk/aws-events-targets";
import { BlockPublicAccess } from '@aws-cdk/aws-s3';  


export class AutomateComplianceStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

// Creating S3 bucket 
    const complianceBucket = new s3.Bucket(this, 'ComplianceBucket',{
      bucketName: cdk.PhysicalName.GENERATE_IF_NEEDED,
//  Ensure S3 bucket that is used to store CloudTrail logs is restricted from public access
      blockPublicAccess: new s3.BlockPublicAccess({

        blockPublicAcls: true, 
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,

      })
    })
// Creating LogGroup with retention policy
    const complianceLogGroup = new logs.LogGroup(this, 'ComplianceLogGroup',{
      logGroupName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      retention: logs.RetentionDays.ONE_YEAR,

    })
// Creating CloudTrail
    const complianceCloudtrail = new cloudtrail.Trail(this, 'ComplianceCloudtrail',{
      bucket: complianceBucket,
      cloudWatchLogGroup: complianceLogGroup,
      cloudWatchLogsRetention: logs.RetentionDays.ONE_YEAR,
      enableFileValidation: true,  // Ensure log file validation is enabled on all CloudTrails
      isMultiRegionTrail: true,   // Ensure log management system by enabling CloudTrail in every region
      sendToCloudWatchLogs: true,  // Ensure CloudTrail transmits logs to CloudWatch Logs.
      trailName: 'ComplianceCloudtrail',

    })
    
    // establishing a role for our lambda function
    const passwordPolicyLambdaRole = new iam.Role(this, 'PasswordPolicyLambdaRole', {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com")
    })
    // adding a manage policy
    passwordPolicyLambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")
    )
    // creating a variable including required lambda properties
    const passwordPolicyLambda = new lambda.Function(this,'PasswordPolicyLambda',{
      runtime: lambda.Runtime.PYTHON_3_9,
      role: passwordPolicyLambdaRole,
      handler: "password_policy_lambda.handler",
      code: lambda.Code.fromAsset(path.join('__dirname','../lambda/PasswordPolicyLambda')),
      timeout: cdk.Duration.seconds(60),


    })
     
   
  }
}
