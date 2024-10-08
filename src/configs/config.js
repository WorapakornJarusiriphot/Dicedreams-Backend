require('dotenv').config();

module.exports = {
  DOMAIN: process.env.DOMAIN,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
  S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
};
