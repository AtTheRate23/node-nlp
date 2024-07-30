const { NlpManager } = require('node-nlp');

// Initialize the NLP Manager with Hindi language
const manager = new NlpManager({ languages: ['hi'] });

// Adding different intents and responses related to elections and politics in Hindi

// Greeting intent
manager.addDocument('hi', 'नमस्ते', 'greeting');
manager.addDocument('hi', 'हैलो', 'greeting');
manager.addDocument('hi', 'कैसे हो?', 'greeting');
manager.addDocument('hi', 'कोई है?', 'greeting');
manager.addDocument('hi', 'शुभ दिन', 'greeting');

manager.addAnswer('hi', 'greeting', 'नमस्ते :-)');
manager.addAnswer('hi', 'greeting', 'नमस्ते, आने के लिए धन्यवाद');
manager.addAnswer('hi', 'greeting', 'नमस्ते, मैं आपकी कैसे मदद कर सकता हूँ?');
manager.addAnswer('hi', 'greeting', 'नमस्ते, मैं आपकी कैसे सहायता कर सकता हूँ?');

// Goodbye intent
manager.addDocument('hi', 'अलविदा', 'goodbye');
manager.addDocument('hi', 'फिर मिलेंगे', 'goodbye');
manager.addDocument('hi', 'बाय', 'goodbye');

manager.addAnswer('hi', 'goodbye', 'फिर मिलेंगे, आने के लिए धन्यवाद');
manager.addAnswer('hi', 'goodbye', 'आपका दिन शुभ हो');
manager.addAnswer('hi', 'goodbye', 'बाय! फिर से जल्द ही आना।');

// Thanks intent
manager.addDocument('hi', 'धन्यवाद', 'thanks');
manager.addDocument('hi', 'शुक्रिया', 'thanks');
manager.addDocument('hi', 'यह सहायक था', 'thanks');
manager.addDocument('hi', 'बहुत बहुत धन्यवाद', 'thanks');

manager.addAnswer('hi', 'thanks', 'मदद करके खुशी हुई!');
manager.addAnswer('hi', 'thanks', 'कभी भी!');
manager.addAnswer('hi', 'thanks', 'मुझे खुशी है।');

// Prime Minister intent
manager.addDocument('hi', 'भारत के वर्तमान प्रधानमंत्री कौन हैं?', 'prime_minister');
manager.addDocument('hi', 'नरेंद्र मोदी के बारे में बताएं', 'prime_minister');

manager.addAnswer('hi', 'prime_minister', 'भारत के वर्तमान प्रधानमंत्री नरेंद्र मोदी हैं।');
manager.addAnswer('hi', 'prime_minister', 'नरेंद्र मोदी भारतीय जनता पार्टी (भाजपा) के सदस्य हैं और 2014 से प्रधानमंत्री हैं।');

// Political Parties intent
manager.addDocument('hi', 'भारत में मुख्य राजनीतिक दल कौन-कौन से हैं?', 'political_parties');
manager.addDocument('hi', 'भाजपा के बारे में जानकारी दें', 'political_parties');
manager.addDocument('hi', 'आम आदमी पार्टी क्या है?', 'political_parties');
manager.addDocument('hi', 'भारत में प्रमुख राजनीतिक दलों के नाम बताएं', 'political_parties');

manager.addAnswer('hi', 'political_parties', 'भारत में मुख्य राजनीतिक दल भाजपा, कांग्रेस और आम आदमी पार्टी हैं।');
manager.addAnswer('hi', 'political_parties', 'भाजपा (भारतीय जनता पार्टी) एक प्रमुख दक्षिणपंथी पार्टी है।');
manager.addAnswer('hi', 'political_parties', 'आम आदमी पार्टी (आप) भ्रष्टाचार और प्रशासनिक मुद्दों पर ध्यान केंद्रित करती है।');
manager.addAnswer('hi', 'political_parties', 'भारत में प्रमुख राजनीतिक दलों में भाजपा, कांग्रेस, तृणमूल कांग्रेस, सीपीआई(एम), डीएमके, बीएसपी और अन्य शामिल हैं।');

// Elections intent
manager.addDocument('hi', 'पिछले भारतीय आम चुनाव में किसने जीत हासिल की?', 'elections');
manager.addDocument('hi', 'भारतीय चुनावों के बारे में बताएं', 'elections');
manager.addDocument('hi', 'भारतीय चुनाव प्रणाली कैसे काम करती है?', 'elections');
manager.addDocument('hi', 'भारत में वोटर कैसे बनें?', 'elections');
manager.addDocument('hi', 'भारत में आम चुनाव कब होते हैं?', 'elections');

manager.addAnswer('hi', 'elections', 'पिछले भारतीय आम चुनाव में भाजपा ने जीत हासिल की थी।');
manager.addAnswer('hi', 'elections', 'भारत में चुनाव प्रणाली में हर 5 साल में लोकसभा के चुनाव होते हैं।');
manager.addAnswer('hi', 'elections', 'भारत में वोटर बनने के लिए नागरिक की उम्र 18 साल होनी चाहिए और उसे चुनाव आयोग में पंजीकृत होना चाहिए।');
manager.addAnswer('hi', 'elections', 'भारत में आम चुनाव हर 5 साल में होते हैं।');

// Parliament intent
manager.addDocument('hi', 'लोकसभा क्या है?', 'parliament');
manager.addDocument('hi', 'राज्यसभा क्या है?', 'parliament');
manager.addDocument('hi', 'लोकसभा और राज्यसभा में क्या अंतर है?', 'parliament');
manager.addDocument('hi', 'भारत में कितने सांसद हैं?', 'parliament');

manager.addAnswer('hi', 'parliament', 'लोकसभा भारतीय संसद का निचला सदन है।');
manager.addAnswer('hi', 'parliament', 'राज्यसभा भारतीय संसद का उच्च सदन है।');
manager.addAnswer('hi', 'parliament', 'लोकसभा का कार्यकाल 5 साल का होता है जबकि राज्यसभा के सदस्य 6 साल के लिए चुने जाते हैं।');
manager.addAnswer('hi', 'parliament', 'भारत में कुल 543 लोकसभा सदस्य और 245 राज्यसभा सदस्य होते हैं।');

// Election Commission intent
manager.addDocument('hi', 'निर्वाचन आयोग क्या है?', 'election_commission');

manager.addAnswer('hi', 'election_commission', 'निर्वाचन आयोग भारत में स्वतंत्र और निष्पक्ष चुनाव करवाने वाली संस्था है।');

// Voting intent
manager.addDocument('hi', 'आप किस पार्टी को वोट देंगे?', 'voting');
manager.addDocument('hi', 'आप किसे वोट करेंगे?', 'voting');
manager.addDocument('hi', 'आपकी पसंदीदा पार्टी कौन सी है?', 'voting');

manager.addAnswer('hi', 'voting', 'मैं व्यक्तिगत रूप से यह जानकारी साझा नहीं कर सकता। आपकी मतदान की पसंद आपकी व्यक्तिगत राय है।');

// Reason for voting intent
manager.addDocument('hi', 'आप किस पार्टी को वोट क्यों देंगे?', 'reason_for_voting');
manager.addDocument('hi', 'आप वोट देने का कारण क्या है?', 'reason_for_voting');
manager.addDocument('hi', 'आप किसे वोट करने का कारण बताएंगे?', 'reason_for_voting');

manager.addAnswer('hi', 'reason_for_voting', 'वोट देने का कारण उम्मीदवार की नीतियाँ, वादे और विश्वसनीयता हो सकते हैं। हर व्यक्ति का अपना दृष्टिकोण और कारण होता है।');

// Satisfaction with government work intent
manager.addDocument('hi', 'क्या आप अपनी लोकसभा के काम से खुश हैं?', 'satisfaction');
manager.addDocument('hi', 'क्या आप राज्यसभा के काम से खुश हैं?', 'satisfaction');
manager.addDocument('hi', 'क्या आप केंद्र सरकार के काम से खुश हैं?', 'satisfaction');

manager.addAnswer('hi', 'satisfaction', 'यह व्यक्तिगत राय पर निर्भर करता है। कुछ लोग सरकार के काम से खुश हो सकते हैं जबकि कुछ नहीं।');

// Purpose of voting intent
manager.addDocument('hi', 'वोट देने का उद्देश्य क्या है?', 'purpose_of_voting');
manager.addDocument('hi', 'वोट क्यों देना चाहिए?', 'purpose_of_voting');
manager.addDocument('hi', 'वोट देने का क्या महत्व है?', 'purpose_of_voting');

manager.addAnswer('hi', 'purpose_of_voting', 'वोट देना लोकतंत्र का महत्वपूर्ण हिस्सा है। यह हमें हमारे नेताओं का चयन करने और हमारी आवाज सुनाने का मौका देता है।');

// Occupation intent
manager.addDocument('hi', 'आप क्या काम करते हैं?', 'occupation');
manager.addDocument('hi', 'आपकी नौकरी क्या है?', 'occupation');
manager.addDocument('hi', 'आपका पेशा क्या है?', 'occupation');

manager.addAnswer('hi', 'occupation', 'मैं एक आभासी सहायक हूँ जो आपकी मदद के लिए यहाँ हूँ।');
manager.addAnswer('hi', 'occupation', 'मैं एक चैटबॉट हूँ और आपकी सहायता के लिए बनाया गया हूँ।');


manager.train().then(async () => {
    manager.save();
})

// Export the trained NLP Manager for use in other parts of the application
module.exports = manager;
