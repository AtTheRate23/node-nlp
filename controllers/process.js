const natural = require('natural');
const fs = require('fs');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const { v4: uuidv4 } = require('uuid');
const nlpService = require('../nlp/nlpService.js');
const { rootDir } = require('../paths.js');
const path = require('path');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/convert.js');

let currentIndex = 0;
const surveyQuestions = [
    "ये call आने वाले हरियाणा विधानसभा चुनाव के सर्वेक्षण के लिए किया गया है। आपसे ली गयी जानकारी गोपनीय रखी जाएगी। क्या मैं आपका नाम जान सकती हूँ?",
    "${prevResp} क्या आप वर्तमान पते पर vote देने के लिए registered है?",
    "क्या आपको लगता है कि मौजूदा सरकार देश के लोगो के लाभ के लिए सही दिशा में आगे रही है।",
    "राष्ट्रीय सुरक्षा जैसे sensitive मुद्दों को संभालने के लिए आप किस party का समर्थन करते हैं?",
    "कोई चिंता नहीं क्या आप आगामी चुनावों में vote देंगे?",
    "कृपया बताए की आपने पिछले चुनाव में किसे vote दिया था।",
    "आपने ${prevResp} को vote क्यों दिया?",
    "आपकी प्रतिक्रिया और समय के लिए धन्यवाद।",
    "आपका दिन शुभ हो।"
];

const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
speechConfig.speechRecognitionLanguage = "hi-IN"; // Set language to Hindi

const synthesizeSpeech = (text, callback) => {
    const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
    synthesizer.speakTextAsync(text, result => {
        synthesizer.close();
        callback(result.audioData);
    }, error => {
        synthesizer.close();
        callback(null, error);
    });
};

const realtimeMessage = (req, res) => {
    const processQuestion = () => {
        if (currentIndex >= surveyQuestions.length) {
            res.send("Survey completed.");
            return;
        }

        const question = surveyQuestions[currentIndex];
        synthesizeSpeech(question, (audioData, error) => {
            if (error) {
                res.send(`Error: ${error.message}`);
                return;
            }

            const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
            const speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

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

                console.log(`Q${currentIndex + 1}: ${question}`);
                console.log(`A${currentIndex + 1}: ${transcription}`);

                // Save the response if needed
                // fs.writeFileSync(`response${currentIndex + 1}.txt`, transcription);

                // Update the previous response variable
                if (currentIndex > 0) {
                    surveyQuestions[currentIndex] = surveyQuestions[currentIndex].replace('${prevResp}', transcription);
                }

                currentIndex++;
                processQuestion();
            });
        });
    };

    processQuestion();
};

module.exports = {
    realtimeMessage
};
