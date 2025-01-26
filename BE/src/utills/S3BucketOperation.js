import { AWS_BUCKET_NAME } from '../config/appConfig.js';
import { s3 } from '../config/S3Config.js'

/**
 * Uploads a file to the specified S3 bucket.
 * @function uploadToS3
 * @param {object} fileObject - The file object to be uploaded.
 * @param {string} [bucketName=AWS_BUCKET_NAME] - The name of the S3 bucket.
 * @returns {Promise<string>} - A promise that resolves with the S3 key of the uploaded file.
 * @throws {Error} - Throws an error if there is an issue with uploading the file.
 */
export async function uploadToS3(fileObject, bucketName = AWS_BUCKET_NAME) {
    const extension = fileObject?.originalname?.split('.')?.pop()
    const fileName = fileObject.originalname.replace(`.${extension}`, '');
    const key = fileName + '_' + Date.now().toString() + `.${extension}`;

    const params = {
        Bucket: bucketName,
        Key: key,
        Body: fileObject.buffer,
        ContentType: fileObject.mimetype,
        ContentDisposition: 'inline',
    };

    try {
        const data = await s3.upload(params).promise()
        return data?.Key;
    }
    catch (error) {
        throw new Error("Error in uploading file", error?.message);
    }
}

function extractFileNameFromUrl(url) {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
        return fileName;
    }
    catch (error) {
        throw new Error("Invalid URL: " + error.message);
    }
}

export async function getPresignedUrl(key, bucketName = AWS_BUCKET_NAME) {

    try {
        //getting file size
        const headObject = await s3.headObject({
            Bucket: bucketName,
            Key: key
        }).promise();

        const signedUrl = s3.getSignedUrl('getObject', {
            Bucket: bucketName,
            Key: key,
            Expires: 60 * 60 * 60
        });
        const fileName = extractFileNameFromUrl(signedUrl)
        const data = {
            fileUrl: signedUrl,
            name: fileName,
            fileSize: headObject?.ContentLength
        }
        return data;
    }
    catch (error) {
        console.log("Error in getting the presigned url.")
    }
}


export async function downloadFromS3(fileKey, bucketName = AWS_BUCKET_NAME) {
    const params = {
        Bucket: bucketName,
        Key: fileKey,
    };
    const data = await s3.getObject(params).promise();
    return data;
}

//remove a file from s3
export async function deleteFileFromS3(fileKey, bucketName = AWS_BUCKET_NAME) {
    try {
        const params = {
            Bucket: bucketName,
            Key: fileKey,
        };
        await s3.deleteObject(params).promise();
        console.log(`File ${fileKey} deleted from ${bucketName}`);
        
        return;
    }
    catch (error) {
        console.log(`Error in deleting file ${fileKey} from ${bucketName}: ${error.message}`);
    }
}