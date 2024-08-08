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

// -----------------------------------------------------------------------------------------------------------------------------

manager.train().then(async () => {
    manager.save();
})

// Export the trained NLP Manager for use in other parts of the application
module.exports = manager;
