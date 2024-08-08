const manager = require('./nlpConfig.js');
const surveyQuestions = require('../serveyQuestions')

const notKeyword = [
    "नहीं",
    "जी नहीं",
    "ना",
    "न",
    "ना ही",
    "नहीं बता सकते"
];

const politicalPartiesKeywords = [
    // INC (Indian National Congress)
    'कांग्रेस',
    'इन्क',
    'भारतीय राष्ट्रीय कांग्रेस',
    'कांग्रेस पार्टी',
    'इंडियन नेशनल कांग्रेस',
    'इंडियन कांग्रेस',
    'राष्ट्रीय कांग्रेस',

    // AAP (Aam Aadmi Party)
    'आप',
    'आम आदमी पार्टी',
    'आप पार्टी',
    'आप का संगठन',
    'आम आदमी संगठन',

    // JJP (Jannayak Janata Party)
    'जेजेपी',
    'जननायक जनता पार्टी',
    'जेजेपी पार्टी',
    'जननायक पार्टी',
    'जे जे पी',

    // BJP (Bharatiya Janata Party)
    'भाजपा',
    'भाजपा पार्टी',
    'भारतीय जनता पार्टी',
    'बीजेपी',
    'बीजेपी पार्टी',

    // Samajwadi Party
    'सपा',
    'समाजवादी पार्टी',
    'सपा पार्टी',
    'समाजवादी पार्टी (सपा)',
    'सपा संगठन'
];



const processMessage = async ({ text, messageIndex }) => {

    // Check if messageIndex is 1 and text belongs to notKeyword
    if (messageIndex === 1 && notKeyword.includes(text)) {
        return null;
    }

    // Define the transcription based on the messageIndex
    let transcription;
    if (messageIndex === 1) {
        transcription = `${text} क्या आप वर्तमान पते पर vote देने के लिए registered है?`;
    } else if (messageIndex === 6) {
        if (!politicalPartiesKeywords.includes(text)) {
            transcription = 'माफ करें! मैं समझ नहीं पा रही हूँ, कृपया पुनः प्रयास करें!';
        } else {
            transcription = `आपने ${text} को vote क्यों दिया?`;
        }
    } else {
        transcription = surveyQuestions[messageIndex];
    }

    // // Process the message using Hindi language
    // const responseObj = await manager.process('hi', text);
    // return responseObj.answer || 'माफ करें! मैं समझ नहीं पा रही हूँ, कृपया पुनः प्रयास करें!';
    return transcription;
};

module.exports = processMessage;
