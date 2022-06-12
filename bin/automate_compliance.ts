#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AutomateComplianceStack } from '../lib/automate_compliance-stack';

const app = new cdk.App();
new AutomateComplianceStack(app, 'AutomateComplianceStack', {
 
});
























/*  
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCloudComplianceCodesStack } from '../lib/aws_cloud_compliance_codes-stack';
import { AwsCloudComplianceUserStack } from '../lib/aws_cloud_compliance_user_stack';

const app = new cdk.App();
new AwsCloudComplianceCodesStack(app, 'AwsCloudComplianceCodesStack', {
 
});

new AwsCloudComplianceUserStack(app, 'AwsCloudComplianceUserStack', {
 
}); */