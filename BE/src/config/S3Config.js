import AWS from 'aws-sdk';
import { DEV_AWS_ACCESS_KEY_ID, DEV_AWS_REGION, DEV_AWS_SECRET_ACCESS_KEY } from '../config/appConfig.js';

const accessKeyId = process.env.NODE_ENV === 'PRODUCTION' ? process.env.AWS_ACCESS_KEY_ID : DEV_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NODE_ENV === 'PRODUCTION' ? process.env.AWS_SECRET_ACCESS_KEY : DEV_AWS_SECRET_ACCESS_KEY;
const region = process.env.NODE_ENV === 'PRODUCTION' ? process.env.AWS_REGION : DEV_AWS_REGION;

export const s3 = new AWS.S3({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region,
});


