const natural = require('natural');
const nlpService = require('../nlp/nlpService.js');

const talkToGemini = (req, res) => {
    res.status(200).json({
        message: 'Hello from Gemini, your AI companion!'
    })
}

const nlp = (req, res) => {
    const { userMessage } = req.body;

    var tokenizer = new natural.WordTokenizer();

    let tokenizedText = tokenizer.tokenize(userMessage)

    let stemmedText = natural.PorterStemmer.tokenizeAndStem(userMessage)

    res.status(200).json({
        tokenizedText,
        stemmedText
    })
}

const nodeNLP = async (req, res) => {
    const { userMessage } = req.body;

    try {
        const response = await nlpService(userMessage);
        res.status(200).json({ response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
}

module.exports = {
    talkToGemini,
    nlp,
    nodeNLP
};