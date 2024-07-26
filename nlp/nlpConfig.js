const { NlpManager } = require('node-nlp');

// Initialize the NLP Manager with Hindi language
const manager = new NlpManager({ languages: ['hi'] });

// Adding different keywords and intents in Hindi
manager.addDocument('hi', 'नमस्ते', 'greeting');
manager.addDocument('hi', 'हैलो', 'greeting');
manager.addDocument('hi', 'नमस्कार', 'greeting');
manager.addDocument('hi', 'शुभ प्रभात', 'greeting');
manager.addDocument('hi', 'शुभ अपराह्न', 'greeting');
manager.addDocument('hi', 'शुभ संध्या', 'greeting');
manager.addDocument('hi', 'क्या हाल है?', 'greeting');
manager.addDocument('hi', 'कैसे हो?', 'greeting');
manager.addDocument('hi', 'नमस्ते', 'greeting');

// Adding different keywords and intents related to Indian politics in Hindi
manager.addDocument('hi', 'भारत के वर्तमान प्रधानमंत्री कौन हैं?', 'politics');
manager.addDocument('hi', 'नरेंद्र मोदी के बारे में बताएं', 'politics');
manager.addDocument('hi', 'भारत में मुख्य राजनीतिक दल कौन-कौन से हैं?', 'politics');
manager.addDocument('hi', 'भाजपा के बारे में जानकारी दें', 'politics');
manager.addDocument('hi', 'पिछले भारतीय आम चुनाव में किसने जीत हासिल की?', 'politics');
manager.addDocument('hi', 'आम आदमी पार्टी क्या है?', 'politics');
manager.addDocument('hi', 'भारत के राष्ट्रपति कौन हैं?', 'politics');
manager.addDocument('hi', 'भारतीय चुनावों के बारे में बताएं', 'politics');
manager.addDocument('hi', 'भारतीय राजनीति में मुख्य मुद्दे क्या हैं?', 'politics');

// Answers for different intents in Hindi
manager.addAnswer('hi', 'greeting', 'नमस्ते! मैं आपकी किस प्रकार सहायता कर सकता हूँ?');
manager.addAnswer('hi', 'politics', 'यहाँ भारतीय राजनीति के बारे में कुछ जानकारी है:\n- भारत के वर्तमान प्रधानमंत्री नरेंद्र मोदी हैं।\n- भारत में मुख्य राजनीतिक दल भाजपा, कांग्रेस और आप हैं।\n- भाजपा (भारतीय जनता पार्टी) एक प्रमुख दक्षिणपंथी पार्टी है।\n- पिछले भारतीय आम चुनाव में भाजपा ने जीत हासिल की थी।\n- आम आदमी पार्टी (आप) भ्रष्टाचार और प्रशासनिक मुद्दों पर ध्यान केंद्रित करती है।\n- भारत के राष्ट्रपति द्रौपदी मुर्मू हैं।\n- भारतीय राजनीति में प्रमुख मुद्दों में आर्थिक विकास, राष्ट्रीय सुरक्षा और सामाजिक न्याय शामिल हैं।');

// Train the model
(async () => {
    await manager.train();
    manager.save();
})();

// Export the trained NLP Manager for use in other parts of the application
module.exports = manager;
