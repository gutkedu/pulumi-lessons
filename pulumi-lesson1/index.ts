import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.Bucket("my-bucket", {
  bucket: "pulumi-gutkedu-bucket",
});

const firehoseRole = new aws.iam.Role("firehoseRole", {
  assumeRolePolicy: `{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "sts:AssumeRole",
        "Principal": {
          "Service": "firehose.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
      }
    ]
  }`,
});

const firehose = new aws.kinesis.FirehoseDeliveryStream(
  "firehose",
  {
    destination: "s3",
    s3Configuration: {
      bucketArn: bucket.arn,
      roleArn: firehoseRole.arn,
    },
  },
  {
    dependsOn: [bucket],
  }
);

// Export the name of the bucket
export const bucketName = bucket.id;
