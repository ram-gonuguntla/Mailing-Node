export const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

export const awsConfig = {
  key: process.env.AWS_ACCESS_KEY_ID,
  secret: process.env.AWS_SECRET_ACCESS_KEY,
  ses: {
    from: {
      default: process.env.FROM_EMAIL || "from@myemail.com",
    },
    region: process.env.AWS_REGION
  }
};