const manager = require('./nlpConfig.js');
const surveyQuestions = require('../serveyQuestions');
const Voting = require('../models/vote.js');

const notKeyword = [
    "नहीं",
    "जी नहीं",
    "ना",
    "न",
    "ना ही",
    "नहीं बता सकते",
    "नहीं।",
    "जी नहीं।",
    "ना।",
    "न।",
    "ना ही।",
    "नहीं बता सकते।",
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
    "हाँ जी",
    "हां",
    "हाँ",
    "जी हां", ,
];

// Object to store responses temporarily
const responses = {
    name: '',
    assembly_name: '',
    central_govt_satisfaction: '',
    state_govt_satisfaction: '',
    mla_satisfaction: '',
    vote_2019: '',
    vote_upcoming: '',
    vote_reason: ''
};

const processMessage = async ({ text, messageIndex, prevTranscription }) => {
    // Check if messageIndex is 1 and text belongs to notKeyword
    // if (messageIndex === 1 && notKeyword.includes(text)) {
    //     return null;
    // }

    // Define the transcription based on the messageIndex
    let transcription;

    switch (messageIndex) {
        case 1:
            if (notKeyword.includes(text)) {
                transcription = 'कोई चिंता नहीं, क्या आप कालका विधान सभा क्षेत्र से बोल रहे हैं?'
            } else {
                transcription = `${text} जी क्या आप कालका विधान सभा क्षेत्र से बोल रहे हैं?`;
                responses.name = text;
            }
            break;

        case 2:
            if (notKeyword.includes(text)) {
                transcription = 'अगर नहीं तो कृपया आपना विधानसभा क्षेत्र बताये ?';
            } else {
                transcription = 'क्या आप केंद्र सरकार के काम से खुश हैं ?';
                responses.assembly_name = 'कालका';
            }
            break;

        case 3:
            if (prevTranscription === 'अगर नहीं तो कृपया आपना विधानसभा क्षेत्र बताये ?') {
                responses.assembly_name = text
                transcription = 'क्या आप केंद्र सरकार के काम से खुश हैं ?';
            } else if (prevTranscription === 'क्या आप केंद्र सरकार के काम से खुश हैं ?') {
                transcription = 'क्या आप राज्य सरकार के काम से खुश हैं ?';
                responses.central_govt_satisfaction = text
            }
            break;

        case 4:
            if (prevTranscription === 'क्या आप केंद्र सरकार के काम से खुश हैं ?') {
                responses.central_govt_satisfaction = text
                transcription = 'क्या आप राज्य सरकार के काम से खुश हैं ?';
            } else if (prevTranscription === 'क्या आप राज्य सरकार के काम से खुश हैं ?') {
                responses.state_govt_satisfaction = text
                transcription = 'क्या आप अपने विधायक के काम से खुश हैं ?';
            }
            break;

        case 5:
            if (prevTranscription === 'क्या आप अपने विधायक के काम से खुश हैं ?') {
                responses.mla_satisfaction = text
                transcription = 'कृपया बताए कि आपने 2019 के विधान सभा चुनाव में किसे vote दिया था ?';
            } else if (prevTranscription === 'क्या आप राज्य सरकार के काम से खुश हैं ?') {
                responses.state_govt_satisfaction = text
                transcription = 'क्या आप अपने विधायक के काम से खुश हैं ?';
            }
            break;

        case 6:
            if (prevTranscription === 'कृपया बताए कि आपने 2019 के विधान सभा चुनाव में किसे vote दिया था ?') {
                responses.vote_2019 = text
                transcription = 'आप आगामी विधान सभा चुनावों में किस party को वोट देंगे ?';
            } else if (prevTranscription === 'क्या आप अपने विधायक के काम से खुश हैं ?') {
                responses.mla_satisfaction = text
                transcription = 'कृपया बताए कि आपने 2019 के विधान सभा चुनाव में किसे vote दिया था ?';
            }
            break;

        case 7:
            if (prevTranscription === 'आप आगामी विधान सभा चुनावों में किस party को वोट देंगे ?') {
                responses.vote_upcoming = text
                transcription = `आपका ${text} को वोट देने का मुख्य कारण क्या है?`;
            } else if (prevTranscription === 'कृपया बताए कि आपने 2019 के विधान सभा चुनाव में किसे vote दिया था ?') {
                responses.vote_2019 = text
                transcription = 'आप आगामी विधान सभा चुनावों में किस party को वोट देंगे ?';
            }
            break;

        case 8:
            if (prevTranscription === 'आप आगामी विधान सभा चुनावों में किस party को वोट देंगे ?') {
                if (politicalPartiesKeywords.includes(text)) {
                    responses.vote_upcoming = text
                    transcription = `आपका ${text} को वोट देने का मुख्य कारण क्या है?`;
                } else {
                    transcription = 'माफ करें! मैं समझ नहीं पा रही हूँ, कृपया पुनः प्रयास करें!';
                }
            } else if (prevTranscription.includes('वोट देने का मुख्य कारण')) {
                responses.vote_reason = text
                Voting.store_resp(responses, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log(result);
                        console.log('response stored in the database successfully')
                    }
                })
                transcription = 'आपकी प्रतिक्रिया और समय के लिए धन्यवाद। आपका दिन शुभ हो।';
            }
            break;

        case 9:
            if (prevTranscription.includes('वोट देने का मुख्य कारण')) {
                responses.vote_reason = text
                Voting.store_resp(responses, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log(result);
                        console.log('response stored in the database successfully')
                    }
                })
                transcription = 'आपकी प्रतिक्रिया और समय के लिए धन्यवाद। आपका दिन शुभ हो।';
            } else if (prevTranscription === 'माफ करें! मैं समझ नहीं पा रही हूँ, कृपया पुनः प्रयास करें!') {
                if (politicalPartiesKeywords.includes(text)) {
                    responses.vote_reason = text
                    Voting.store_resp(responses, (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            // console.log(result);
                            console.log('response stored in the database successfully')
                        }
                    })
                    transcription = `आपकी प्रतिक्रिया और समय के लिए धन्यवाद। आपका दिन शुभ हो।`;
                } else {
                    transcription = 'माफ करें! मैं समझ नहीं पा रही हूँ, कृपया पुनः प्रयास करें!';
                }
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
