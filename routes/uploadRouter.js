const express = require('express');
const bodyParser = require('body-parser');
const busboy = require('connect-busboy');
const AWS = require('aws-sdk');
const fs = require('fs');
const fileType = require('file-type');
const bluebird = require('bluebird');
const multiparty = require('multiparty');

const BUCKET_NAME = 'birdviewbucket';
const IAM_USER_KEY = 'AKIAIX2Y7UI5T7Q3M22A';
const IAM_USER_SECRET = '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';

AWS.config.update({
  accessKeyId: IAM_USER_KEY,
  secretAccessKey: IAM_USER_SECRET
});
AWS.config.setPromisesDependency(bluebird);
const s3 = new AWS.S3();

const uploadFile = (buffer, name, type) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: BUCKET_NAME,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`
  };
  return s3.upload(params).promise();
};

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
  .get((req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
  })
  .post((request, response, next) => {
    console.log('received');
    const form = new multiparty.Form();
    form.parse(request, async (error, fields, files) => {
      if (error) throw new Error(error);
      try {
        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        const type = fileType(buffer);
        const timestamp = Date.now().toString();
        const fileName = `${timestamp}-lg`;
        const data = await uploadFile(buffer, fileName, type);
        console.log('Data uploaded: ', data);
        return response.status(200).send(data);
      } catch (error) {
        return response.status(400).send(error);
      }
    });
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
  });

module.exports = uploadRouter;