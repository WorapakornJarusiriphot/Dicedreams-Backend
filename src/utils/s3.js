require('dotenv').config();
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

async function uploadImageToS3(baseImage) {
  const ext = baseImage.substring(
    baseImage.indexOf("/") + 1,
    baseImage.indexOf(";base64")
  );

  const filename = `${uuidv4()}.${ext}`;
  const imageBuffer = Buffer.from(baseImage.split(",")[1], 'base64');

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: filename,
    Body: imageBuffer,
    ContentEncoding: 'base64',
    ContentType: `image/${ext}`,
  };

  const uploadResult = await s3.upload(params).promise();
  return uploadResult.Location;
}

module.exports = { uploadImageToS3 };
