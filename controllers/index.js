const natural = require('natural');
const fs = require('fs');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const { v4: uuidv4 } = require('uuid');
const { GoogleGenerativeAI } = require("@google/generative-ai")
const nlpService = require('../nlp/nlpService.js');
const { rootDir } = require('../paths.js');
const path = require('path');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/convert.js');
const surveyQuestions = require('../serveyQuestions.js');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

let currentIndex = 0;
const messages = Array.from({ length: 13 }, (_, i) => `../train/${i + 1}-message.wav`);

const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION)
speechConfig.speechRecognitionLanguage = "hi-IN"; // Set language to Hindi

const processMessage = (req, res) => {
    if (currentIndex < messages.length) {
        transcribeAndSpeak(messages[currentIndex], (transcription, audioUrl) => {
            currentIndex++;
            console.log(currentIndex);
            res.status(200).json({ transcription, audioUrl });
        });
    } else {
        currentIndex = 0; // Reset the index to start over
        res.status(200).json({ transcription: 'All messages processed', audioUrl: null });
    }
}

const realtimeMessage = (req, res, callback) => {
    try {

        const response = req.body;
        const { text, messageIndex } = response;

        // Define the transcription based on the messageIndex
        let transcription;
        if (messageIndex === 1) {
            transcription = `${text} क्या आप वर्तमान पते पर vote देने के लिए registered है?`;
        } else if (messageIndex === 6) {
            transcription = `आपने ${text} को vote क्यों दिया?`;
        } else {
            transcription = surveyQuestions[messageIndex];
        }

        synthesizeSpeech(transcription, (transcription, audioUrl) => {
            if (audioUrl) {
                res.status(200).json({ transcription, audioUrl });
            } else {
                res.status(500).json({ message: 'Text-to-speech synthesis failed.' });
            }
        });
    } catch (error) {
        callback(`Error: ${error.message}`, null);
    }
}

const talkToGemini = async (req, res) => {
    const userInput = req.body.text;

    try {
        const result = await model.generateContent(userInput)
        const response = result.response;
        const transcription = response.text();

        // Function to truncate transcription to a specified number of sentences
        const truncateToSentences = (text, numSentences) => {
            const sentences = text.split(/[।\n]+/); // Split by sentence terminators
            return sentences.slice(0, numSentences).join('। '); // Join back limited sentences
        };

        const shortenedTranscription = truncateToSentences(transcription, 2); // Limit to 2 sentences

        synthesizeSpeech(shortenedTranscription, (transcription, audioUrl) => {
            if (audioUrl) {
                res.status(200).json({ transcription, audioUrl });
            } else {
                res.status(500).json({ message: 'Text-to-speech synthesis failed.' });
            }
        });
    } catch (error) {
        console.error('Error with Gemini API:', error);
        if (error.message.includes('LANGUAGE')) {
            res.status(400).json({ error: 'Language issue with the API request.' });
        } else if (error.message.includes('SAFETY')) {
            res.status(400).json({ error: 'Safety issue with the API response.' });
        } else {
            res.status(500).json({ error: 'An error occurred while generating the response.' });
        }
    }
}


const synthesizeSpeech = (transcription, callback) => {
    if (!transcription) {
        return callback(null, null);
    }

    const ttsConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
    ttsConfig.speechSynthesisLanguage = "hi-IN";
    ttsConfig.speechSynthesisVoiceName = "hi-IN-KavyaNeural";

    const synthesizer = new sdk.SpeechSynthesizer(ttsConfig);

    synthesizer.speakTextAsync(transcription, result => {
        const audioBuffer = result.audioData;
        uploadToCloudinary(audioBuffer, (err, cloudinaryUrl) => {
            synthesizer.close();
            if (err) {
                callback(transcription, null);
            } else {
                callback(transcription, cloudinaryUrl);
            }
        });
    }, error => {
        console.error(error);
        synthesizer.close();
        callback(transcription, null);
    });
};

const nodeNLP = async (req, res) => {
    const response = req.body;

    try {
        const transcription = await nlpService(response);
        synthesizeSpeech(transcription, (transcription, audioUrl) => {
            if (audioUrl) {
                res.status(200).json({ transcription, audioUrl });
            } else {
                res.status(500).json({ message: 'Text-to-speech synthesis failed.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
}

const transcribeAndSpeak = (filePath, callback) => {
    const wavPath = path.join(__dirname, filePath);

    try {
        let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(wavPath));
        let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        speechRecognizer.recognizeOnceAsync(result => {
            let transcription;
            switch (result.reason) {
                case sdk.ResultReason.RecognizedSpeech:
                    transcription = result.text;
                    break;
                case sdk.ResultReason.NoMatch:
                    transcription = "No speech could be recognized.";
                    break;
                case sdk.ResultReason.Canceled:
                    const cancellation = sdk.CancellationDetails.fromResult(result);
                    transcription = `Cancelled: ${cancellation.reason}`;
                    break;
            }

            synthesizeSpeech(transcription, callback);
        });
    } catch (error) {
        callback(`Error: ${error.message}`, null);
    }
};

const deleteAudio = (req, res) => {
    const audioUrl = req.body.url;

    const publicId = path.basename(audioUrl, path.extname(audioUrl)); // Extract the public ID from the URL

    deleteFromCloudinary(publicId, (err, result) => {
        if (err) {
            return res.status(500).json({ success: false });
        }

        res.json({ success: true });
    });
}

const restartProcessing = (req, res) => {
    currentIndex = 0;
    res.status(200).json({ message: 'Processing restarted.' });
}

module.exports = {
    talkToGemini,
    nodeNLP,
    processMessage,
    realtimeMessage,
    deleteAudio,
    restartProcessing
};