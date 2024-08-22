const manager = require('./nlpConfig.js');
const surveyQuestions = require('../serveyQuestions');
const Voting = require('../models/vote.js');
const axios = require('axios');
const { translate } = require('bing-translate-api');

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
const initial_responses = {
    name: '',
    assembly_name: '',
    central_govt_satisfaction: '',
    state_govt_satisfaction: '',
    mla_satisfaction: '',
    vote_2019: '',
    vote_upcoming: '',
    vote_reason: ''
};

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


function getName() {
    return new Promise((resolve, reject) => {
        Voting.get_name_data((err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                const names = result.map(item => item.name);
                resolve(names);
            }
        });
    });
}

// // Function to translate text to English using LibreTranslate// Function to translate text to English using Bing Translator API
// async function translateToEnglish(text) {
//     try {
//         const result = await translate(text, null, 'en');
//         return result.translation;
//     } catch (error) {
//         console.error('Error translating text:', error);
//         throw error;
//     }
// }

const nameArray = [
    "परमजीत",
    "जय भगवान",
    "संदीप यादव",
    "अशोक कुमार",
    "सतवीर",
    "सतबीर",
    "सुनील",
    "मुक्ति सिदाना",
    "गौरव शर्मा",
    "निर्मल रानी",
    "शिल्पा कटारिया",
    "सुषमा चौधरी",
    "चंदर पाटी",
    "हिमांशु सिंगला",
    "रामंदिप कौर",
    "रिंकू",
    "रिंकू",
    "उषा रानी",
    "हरविंदर सिंह",
    "मणिता",
    "जस पाल",
    "इंदरजीत कौर",
    "प्रिंस स्याल",
    "नरेश",
    "दिनेश",
    "सुषिता",
    "पंकज",
    "छोटू",
    "सुरेश",
    "हुकम दाई",
    "वीरेंद्र सिंह",
    "पूजा",
    "राजेश गुप्ता",
    "उर्मिला देवी",
    "सोनिया",
    "शिंगारा राम",
    "शामशेर सिंह",
    "शिवानी भारद्वाज",
    "मदन लाल",
    "सुलेंद्र कुमार",
    "सीमा रानी",
    "दलजीत कुमार",
    "सुनील कुमार",
    "सोमिता",
    "दीपक कुमार",
    "हरिश कुमार",
    "दामनजीत सिंह",
    "कमल कुमार",
    "सौरव",
    "निखिल गुप्ता",
    "आदित्य",
    "संदीप गुप्ता",
    "प्रिय रंजन समल"
]

const updateResponse = async (fieldName, value) => {
    await new Promise((resolve, reject) => {
        Voting.updateResponse(responseId, { [fieldName]: value }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


let responseId;

const processMessage = async ({ text, messageIndex, prevTranscription }) => {

    try {
        // if messageIndex == 0 then insert
        if (messageIndex == 0) {
            // Insert an empty response and get the ID
            await new Promise((resolve, reject) => {
                Voting.insertEmptyResponse(initial_responses, (err, id) => {
                    if (err) {
                        reject(err);
                    } else {
                        responseId = id;
                        resolve();
                    }
                });
            });
        }

        // Define the transcription based on the messageIndex
        let transcription;

        switch (messageIndex) {
            case 1:
                // Fetch the names from the database
                const names = await getName();
                console.log("names", names)

                // Check if any of the split words match a name in the database
                let matchedName;
                if (text) {
                    for (const name of names) {
                        if (text.includes(name)) {
                            matchedName = name;
                            break;
                        }
                    }
                }

                if (matchedName) {
                    transcription = `${matchedName} जी क्या आप कालका विधान सभा क्षेत्र से बोल रहे हैं?`;
                    responses.name = text;
                } else if (notKeyword.includes(text)) {
                    responses.name = text;
                    transcription = 'क्या आप कालका विधान सभा क्षेत्र से बोल रहे हैं?';
                } else {
                    responses.name = text;
                    transcription = 'क्या आप कालका विधान सभा क्षेत्र से बोल रहे हैं?';
                }
                updateResponse('name', text)
                break;

            case 2:
                if (notKeyword.includes(text)) {
                    transcription = 'अगर नहीं तो कृपया आपना विधानसभा क्षेत्र बताये ?';
                } else {
                    transcription = 'क्या आप केंद्र सरकार के काम से खुश हैं ?';
                    responses.assembly_name = 'कालका';
                    updateResponse('assembly_name', 'कालका')
                }
                break;

            case 3:
                if (prevTranscription === 'अगर नहीं तो कृपया आपना विधानसभा क्षेत्र बताये ?') {
                    responses.assembly_name = text
                    transcription = 'क्या आप केंद्र सरकार के काम से खुश हैं ?';
                    updateResponse('assembly_name', text)
                } else if (prevTranscription === 'क्या आप केंद्र सरकार के काम से खुश हैं ?') {
                    transcription = 'क्या आप राज्य सरकार के काम से खुश हैं ?';
                    responses.central_govt_satisfaction = text;
                    updateResponse('central_govt_satisfaction', text)
                }
                break;

            case 4:
                if (prevTranscription === 'क्या आप केंद्र सरकार के काम से खुश हैं ?') {
                    responses.central_govt_satisfaction = text
                    transcription = 'क्या आप राज्य सरकार के काम से खुश हैं ?';
                    updateResponse('central_govt_satisfaction', text)
                } else if (prevTranscription === 'क्या आप राज्य सरकार के काम से खुश हैं ?') {
                    responses.state_govt_satisfaction = text
                    transcription = 'क्या आप अपने विधायक के काम से खुश हैं ?';
                    updateResponse('state_govt_satisfaction', text)
                }
                break;

            case 5:
                if (prevTranscription === 'क्या आप अपने विधायक के काम से खुश हैं ?') {
                    responses.mla_satisfaction = text
                    transcription = 'कृपया बताए कि आपने 2019 के विधान सभा चुनाव में किसे vote दिया था ?';
                    updateResponse('mla_satisfaction', text)
                } else if (prevTranscription === 'क्या आप राज्य सरकार के काम से खुश हैं ?') {
                    responses.state_govt_satisfaction = text
                    transcription = 'क्या आप अपने विधायक के काम से खुश हैं ?';
                    updateResponse('state_govt_satisfaction', text)
                }
                break;

            case 6:
                if (prevTranscription === 'कृपया बताए कि आपने 2019 के विधान सभा चुनाव में किसे vote दिया था ?') {
                    responses.vote_2019 = text
                    transcription = 'आप आगामी विधान सभा चुनावों में किस party को वोट देंगे ?';
                    updateResponse('vote_2019', text)
                } else if (prevTranscription === 'क्या आप अपने विधायक के काम से खुश हैं ?') {
                    responses.mla_satisfaction = text
                    transcription = 'कृपया बताए कि आपने 2019 के विधान सभा चुनाव में किसे vote दिया था ?';
                    updateResponse('mla_satisfaction', text)
                }
                break;

            case 7:
                if (prevTranscription === 'आप आगामी विधान सभा चुनावों में किस party को वोट देंगे ?') {
                    responses.vote_upcoming = text
                    let matchedParty;
                    if (text) {
                        for (const party of politicalPartiesKeywords) {
                            if (text.includes(party)) {
                                matchedParty = party;
                                break;
                            }
                        }
                        if (matchedParty) {
                            break;
                        }
                    }
                    transcription = `आपका ${matchedParty} को वोट देने का मुख्य कारण क्या है?`;
                    updateResponse('vote_upcoming', text)
                } else if (prevTranscription === 'कृपया बताए कि आपने 2019 के विधान सभा चुनाव में किसे vote दिया था ?') {
                    responses.vote_2019 = text
                    transcription = 'आप आगामी विधान सभा चुनावों में किस party को वोट देंगे ?';
                    updateResponse('vote_2019', text)
                }
                break;

            case 8:
                if (prevTranscription === 'आप आगामी विधान सभा चुनावों में किस party को वोट देंगे ?') {
                    responses.vote_upcoming = text
                    let matchedParty;
                    if (text) {
                        for (const party of politicalPartiesKeywords) {
                            if (text.includes(party)) {
                                matchedParty = party;
                                break;
                            }
                        }
                        if (matchedParty) {
                            transcription = `आपका ${matchedParty} को वोट देने का मुख्य कारण क्या है?`;
                            updateResponse('vote_upcoming', text)
                            break;
                        } else {
                            transcription = 'माफ करें! मैं समझ नहीं पा रही हूँ, कृपया पुनः प्रयास करें!';
                        }
                    }
                } else if (prevTranscription.includes('वोट देने का मुख्य कारण')) {
                    responses.vote_reason = text
                    updateResponse('vote_reason', text)
                    transcription = 'आपकी प्रतिक्रिया और समय के लिए धन्यवाद। आपका दिन शुभ हो।';
                }
                break;

            case 9:
                if (prevTranscription.includes('वोट देने का मुख्य कारण')) {
                    responses.vote_reason = text
                    updateResponse('vote_reason', text)
                    transcription = 'आपकी प्रतिक्रिया और समय के लिए धन्यवाद। आपका दिन शुभ हो।';
                } else if (prevTranscription === 'माफ करें! मैं समझ नहीं पा रही हूँ, कृपया पुनः प्रयास करें!') {
                    let matchedParty;
                    if (text) {
                        for (const party of politicalPartiesKeywords) {
                            if (text.includes(party)) {
                                matchedParty = party;
                                break;
                            }
                        }
                        if (matchedParty) {
                            transcription = `आपका ${matchedParty} को वोट देने का मुख्य कारण क्या है?`;
                            updateResponse('vote_upcoming', text)
                            break;
                        } else {
                            transcription = 'माफ करें! मैं समझ नहीं पा रही हूँ, कृपया पुनः प्रयास करें!';
                        }
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

    } catch (err) {
        console.error(err);
    }
};

module.exports = processMessage;
