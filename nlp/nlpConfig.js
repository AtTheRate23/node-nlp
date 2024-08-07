const { NlpManager } = require('node-nlp');

// Initialize the NLP Manager with Hindi language
const manager = new NlpManager({ languages: ['hi'] });

// Adding different intents and responses related to elections and politics in Hindi

// Greeting intent
manager.addDocument('hi', 'नमस्ते', 'greeting');
manager.addDocument('hi', 'हैलो', 'greeting');
manager.addDocument('hi', 'हेलो', 'greeting');
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
manager.addDocument('hi', 'थैंक यू', 'thanks');
manager.addDocument('hi', 'शुक्रिया', 'thanks');
manager.addDocument('hi', 'यह सहायक था', 'thanks');
manager.addDocument('hi', 'बहुत बहुत धन्यवाद', 'thanks');

manager.addAnswer('hi', 'thanks', 'मदद करके खुशी हुई!');
manager.addAnswer('hi', 'thanks', 'कभी भी!');
manager.addAnswer('hi', 'thanks', 'मुझे खुशी है।');

// Start intents

manager.addDocument('hi', 'प्रारंभ', 'start');

manager.addAnswer('hi', 'start', 'ये call आने वाले हरियाणा विधानसभा चुनाव के सर्वेक्षण के लिए किया गया है। आपसे ली गयी जानकारी गोपनीय रखी जाएगी। क्या मैं आपका नाम जान सकती हूँ?');


// ------------------------------------------- Political Parties intents ----------------------------------------------------

// bjp
manager.addDocument('hi', 'भाजपा', 'political_parties_bjp');
manager.addDocument('hi', 'भाजपा पार्टी', 'political_parties_bjp');
manager.addDocument('hi', 'भारतीय जनता पार्टी', 'political_parties_bjp');
manager.addDocument('hi', 'बीजेपी', 'political_parties_bjp');
manager.addDocument('hi', 'बीजेपी पार्टी', 'political_parties_bjp');

manager.addAnswer('hi', 'political_parties_bjp', 'आपका बी जे पी को वोट देने का मुख्य कारण क्या है?')

// inc
manager.addDocument('hi', 'कांग्रेस', 'political_parties_inc');
manager.addDocument('hi', 'इन्क', 'political_parties_inc');
manager.addDocument('hi', 'भारतीय राष्ट्रीय कांग्रेस', 'political_parties_inc');
manager.addDocument('hi', 'कांग्रेस पार्टी', 'political_parties_inc');
manager.addDocument('hi', 'इंडियन नेशनल कांग्रेस', 'political_parties_inc');
manager.addDocument('hi', 'इंडियन कांग्रेस', 'political_parties_inc');
manager.addDocument('hi', 'राष्ट्रीय कांग्रेस', 'political_parties_inc');

manager.addAnswer('hi', 'political_parties_inc', 'आपका कांग्रेस को वोट देने का मुख्य कारण क्या है?')


// aap
manager.addDocument('hi', 'आप', 'political_parties_aap');
manager.addDocument('hi', 'आम आदमी पार्टी', 'political_parties_aap');
manager.addDocument('hi', 'आप पार्टी', 'political_parties_aap');
manager.addDocument('hi', 'आप का संगठन', 'political_parties_aap');
manager.addDocument('hi', 'आम आदमी संगठन', 'political_parties_aap');

manager.addAnswer('hi', 'political_parties_aap', 'आपका आम आदमी पार्टी को वोट देने का मुख्य कारण क्या है?')

// aap
manager.addDocument('hi', 'जेजेपी', 'political_parties_jjp');
manager.addDocument('hi', 'जननायक जनता पार्टी', 'political_parties_jjp');
manager.addDocument('hi', 'जेजेपी पार्टी', 'political_parties_jjp');
manager.addDocument('hi', 'जननायक पार्टी', 'political_parties_jjp');
manager.addDocument('hi', 'जे जे पी', 'political_parties_jjp');

manager.addAnswer('hi', 'political_parties_jjp', 'आपका जे जे पी को वोट देने का मुख्य कारण क्या है?')

// -----------------------------------------------------------------------------------------------------------------------------

manager.train().then(async () => {
    manager.save();
})

// Export the trained NLP Manager for use in other parts of the application
module.exports = manager;
