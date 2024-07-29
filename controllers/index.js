const natural = require('natural');
const fs = require('fs');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const { v4: uuidv4 } = require('uuid');
const { OpenAI } = require("openai")
const { GoogleGenerativeAI } = require("@google/generative-ai")
const nlpService = require('../nlp/nlpService.js');
const path = require('path')

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

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
        res.status(200).json({ transcription: 'All messages processed', audioUrl: null });
    }
}

const realtimeMessage = (req, res) => {
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    const speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    const userText = req.body.text;

    console.log("userText", userText)
}

const talkToGemini = async (req, res) => {
    const userInput = req.body.text;

    try {
        const result = await model.generateContent(userInput)
        const response = await result.response;
        const transcription = response.text();

        // Function to truncate transcription to a specified number of sentences
        const truncateToSentences = (text, numSentences) => {
            const sentences = text.split(/[।\n]+/); // Split by sentence terminators
            return sentences.slice(0, numSentences).join('। ') + '।'; // Join back limited sentences
        };

        const shortenedTranscription = truncateToSentences(transcription, 2); // Limit to 2 sentences

        synthesizeSpeech(shortenedTranscription, (text, audioPath) => {
            if (audioPath) {
                res.status(200).json({ transcription: text, audioPath });
            } else {
                res.status(500).json({ message: 'Text-to-speech synthesis failed.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the response' });
    }
}

const talkToOpenAI = async (req, res) => {
    const userInput = req.body.text;

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userInput }],
            max_tokens: 150,
        });

        res.json({ response: response.choices[0].message.content.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while generating the response' });
    }
}

const naturalNLP = (req, res) => {
    const { userMessage } = req.body;

    var tokenizer = new natural.WordTokenizer();

    let tokenizedText = tokenizer.tokenize(userMessage)

    let stemmedText = natural.PorterStemmer.tokenizeAndStem(userMessage)

    res.status(200).json({
        tokenizedText,
        stemmedText
    })
}

const synthesizeSpeech = (transcription, callback) => {
    if (!transcription) {
        return callback(null, null);
    }

    const ttsConfig = sdk.SpeechConfig.fromSubscription(process.env.SPEECH_KEY, process.env.SPEECH_REGION);
    ttsConfig.speechSynthesisLanguage = "hi-IN";
    ttsConfig.speechSynthesisVoiceName = "hi-IN-KavyaNeural";

    const audioFileName = `tts-${uuidv4()}.wav`;
    const audioFilePath = path.join(__dirname, 'uploads', audioFileName);
    const audioOutput = sdk.AudioConfig.fromAudioFileOutput(audioFilePath);
    const synthesizer = new sdk.SpeechSynthesizer(ttsConfig, audioOutput);

    synthesizer.speakTextAsync(transcription, result => {
        synthesizer.close();
        callback(transcription, `/uploads/${audioFileName}`);
    }, error => {
        console.error(error);
        synthesizer.close();
        callback(transcription, null);
    });
};

const nodeNLP = async (req, res) => {
    const { userMessage } = req.body;

    try {
        const transcription = await nlpService(userMessage);
        synthesizeSpeech(transcription, (text, audioPath) => {
            if (audioPath) {
                res.status(200).json({ transcription: text, audioPath });
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

    console.log(wavPath)

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

            console.log("/process transcription", transcription)

            synthesizeSpeech(transcription, callback);
        });
    } catch (error) {
        callback(`Error: ${error.message}`, null);
    }
};

module.exports = {
    talkToGemini,
    talkToOpenAI,
    naturalNLP,
    nodeNLP,
    processMessage,
    realtimeMessage
};