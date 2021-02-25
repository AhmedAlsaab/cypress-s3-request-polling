const AWS = require('aws-sdk');

const BUCKET = Cypress.env('BUCKET_NAME');

const createS3Client = () => {
  const credentials = {
    accessKeyId: Cypress.env('AWS_ACCESS_KEY'),
    secretAccessKey: Cypress.env('AWS_SECRET_KEY'),
  };

  const s3 = new AWS.S3({
    credentials,
    s3ForcePathStyle: true,
  });

  return s3;
};

const client = createS3Client();

export const listS3Objects = () => {
  return new Cypress.Promise((resolve, reject) => {
    client.listObjects(
      { Bucket: BUCKET },
      (err, data) => {
        err ? reject(err) : resolve(data);
      },
      1000
    );
  });
};

export const getObjectFromS3 = (filename) => {
  return new Cypress.Promise((resolve, reject) => {
    client.getObject(
      {
        Bucket: BUCKET,
        Key: filename,
      },
      (err, data) => {
        err ? reject(err) : resolve(data);
      },
      1000
    );
  });
};

export const requestPoll = (fileToFind, requestCounter = 0) => {
  if (requestCounter !== 5) {
    cy.listS3Objects().then((resp) => {
      if (findFile(fileToFind, resp.Contents)) return cy.wrap('File found');

      cy.wait(2000);

      cy.log(`Trying to find file... Attempt: ${requestCounter}`);

      requestPoll(fileToFind, ++requestCounter);
    });
  } else {
    return cy.wrap('File not found');
  }
};

const findFile = (fileName, bucketContent) => {
  return bucketContent.find(({ Key }) => Key === fileName);
};
