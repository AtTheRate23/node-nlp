const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

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

module.exports = { convertMp3ToWav };
