// import ffmpeg from 'fluent-ffmpeg';
import db from "../models/index.js";
// import S3 from "aws-sdk/clients/s3.js";
import JWT from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import AWS from 'aws-sdk';
import url from 'url';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import sharp from 'sharp';




// Promisify fs functions for easier async/await usage
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);
const mkdir = promisify(fs.mkdir);

// Configure AWS SDK
if (!AWS.config.credentials) {
    AWS.config.update({
        accessKeyId: process.env.AccessKeyId,
        secretAccessKey: process.env.SecretAccessKey,
        region: process.env.Region,
    });
}
console.log('AWS Credentials:', {
    accessKeyId: process.env.AccessKeyId,
        secretAccessKey: process.env.SecretAccessKey,
        region: process.env.Region,
});

const s3 = new AWS.S3();



// Function to delete a file from S3 using its URL
export async function deleteFileFromS3(fileUrl) {
  // Parse the URL to get the bucket name and key
  const parsedUrl = url.parse(fileUrl);
  const bucketName = parsedUrl.host.split('.')[0];
  const key = decodeURIComponent(parsedUrl.pathname.slice(1));

  console.log(`Bucket ${bucketName} Key: ${key}`)
  // Set up parameters for the delete operation
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  try {
    // Delete the object using async/await
    const data = await s3.deleteObject(params).promise();
    console.log(`File '${key}' successfully deleted from bucket '${bucketName}'`);
    return data;
  } catch (err) {
    console.log(err)
    console.error(`Error deleting file: ${err.message}`);
    throw err;
  }
}



export const uploadMedia = (fieldname, fileContent, mime = "image/jpeg", folder = "media") => {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.Bucket,
            Key: `${folder}/${fieldname}${Date.now()}`,
            Body: fileContent,
            ContentDisposition: 'inline',
            ContentType: mime,
        };

        s3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data.Location);
            }
        });
    });
};

export const createThumbnailAndUpload = async (fileContent, fieldname, folder = "media") => {
    const image = sharp(fileContent);
    const metadata = await image.metadata();
    const width = 400//metadata.width / 2; // half size
    const height = Math.round((metadata.height / metadata.width) * width);

    const thumbnailBuffer = await image.resize(width, height).toBuffer();
    const thumbnailUrl = await uploadMedia(`thumbnail_${fieldname}`, thumbnailBuffer, "image/jpeg", folder);
    return thumbnailUrl;
};