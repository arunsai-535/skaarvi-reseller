import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const s3 = new AWS.S3();
export const bucket = process.env.AWS_S3_BUCKET;

// Upload file to S3
export async function uploadToS3(file, folder = 'products') {
  const fileName = `${folder}/${Date.now()}-${file.name}`;

  const params = {
    Bucket: bucket,
    Key: fileName,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read',
  };

  try {
    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
}

// Delete file from S3
export async function deleteFromS3(fileUrl) {
  try {
    const key = fileUrl.split('.com/')[1];
    await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
    return true;
  } catch (error) {
    throw new Error(`Failed to delete file from S3: ${error.message}`);
  }
}
