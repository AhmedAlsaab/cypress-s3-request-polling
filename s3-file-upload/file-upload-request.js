const secret = require('./s3-secrets').s3Secrets;
const fs = require('fs-extra');
const AWS = require('aws-sdk');

const createS3Client = () => {
  const credentials = {
    accessKeyId: secret.AWS_ACCESS_KEY,
    secretAccessKey: secret.AWS_SECRET_KEY,
  };

  const s3 = new AWS.S3({
    credentials,
    s3ForcePathStyle: true,
  });

  return s3;
};

const uploadFile = (fileName) => {
  return new Promise((resolve, reject) => {
    const client = createS3Client();

    const destinationKey = `cypress/nasdaq-tickers.csv`;

    fs.readFile(fileName, 'utf-8', (err, fileContent) => {
      const uploadParams = { Bucket: secret.BUCKET_NAME, Key: destinationKey, Body: fileContent };

      client.upload(uploadParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log('Successfully uploaded file: ', data);
          resolve(data);
        }
      });
    });
  });
};

uploadFile('nasdaq-tickers.csv');
