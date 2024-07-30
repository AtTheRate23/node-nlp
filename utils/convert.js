const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk')

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

function convertMp3ToWav(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat('wav')
            .on('end', () => {
                resolve(outputPath);
            })
            .on('error', (err) => {
                reject(err);
            })
            .save(outputPath);
    });
}

const uploadToS3 = (filePath, callback) => {
    const fileContent = fs.readFileSync(filePath);
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: path.basename(filePath),
        Body: fileContent,
        ContentType: 'audio/wav',
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error(err);
            callback(null);
        } else {
            callback(data.Location);
        }
    });
};

const deleteFromS3 = (params, callback) => {
    s3.deleteObject(params, (err, data) => {
        if (err) {
            console.error('Error deleting audio file from S3:', err);
            return callback(err, null);
        }

        callback(null, data);
    });
};

module.exports = { convertMp3ToWav, uploadToS3, deleteFromS3 };
