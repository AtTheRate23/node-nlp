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

const answer = [
    "हां जी",
];

const processMessage = async ({ text, messageIndex }) => {
    // Check if messageIndex is 1 and text belongs to notKeyword
    if (messageIndex === 1 && notKeyword.includes(text)) {
        return null;
    }

    // Define the transcription based on the messageIndex
    let transcription;

    switch (messageIndex) {
        case 1:
            transcription = `${text} जी क्या आप कालका विधान सभा क्षेत्र से बोल रहे हैं?`;
            break;
        
        case 2:
            if (answer.includes(text)) {
                transcription = 'क्या आप केंद्र सरकार के काम से खुश हैं?';
            } else {
                transcription = 'अगर नहीं तो कृपया आपना विधानसभा क्षेत्र बताये ?';
            }
            break;
            
        case 8:
            if (politicalPartiesKeywords.includes(text)) {
                transcription = `आपका ${text} को वोट देने का मुख्य कारण क्या है?`;
            } else {
                transcription = 'माफ करें! मैं समझ नहीं पा रही हूँ, कृपया पुनः प्रयास करें!';
            }
            break;

        default:
            transcription = surveyQuestions[messageIndex];
            break;
    }

    // Process the message using Hindi language (if needed)
    // const responseObj = await manager.process('hi', text);
    // return responseObj.answer || 'माफ करें! मैं समझ नहीं पा रही हूँ, कृपया पुनः प्रयास करें!';

    return transcription;
};

module.exports = processMessage;
