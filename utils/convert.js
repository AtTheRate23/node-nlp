const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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

const uploadToCloudinary = (arrayBuffer, callback) => {
    const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
    const stream = cloudinary.uploader.upload_stream({ resource_type: 'raw' }, (error, result) => {
        if (error) {
            console.error('Error uploading to Cloudinary:', error);
            return callback(error, null);
        }
        callback(null, result.secure_url);
    });

    stream.end(buffer);
};

const deleteFromCloudinary = (publicId, callback) => {
    cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, (error, result) => {
        if (error) {
            console.error('Error deleting from Cloudinary:', error);
            return callback(error, null);
        }
        callback(null, result);
    });
};

module.exports = { convertMp3ToWav, uploadToCloudinary, deleteFromCloudinary };
