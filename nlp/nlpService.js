const manager = require('./nlpConfig.js');

const processMessage = async (message) => {
    // Process the message using Hindi language
    const responseObj = await manager.process('hi', message);
    return responseObj.answer || 'माफ करें! मैं समझ नहीं पा रही हूँ, कृपया पुनः प्रयास करें!';
};

module.exports = processMessage;
