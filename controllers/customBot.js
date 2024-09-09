const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });

exports.processQuestionWithoutAI = async (data, question) => {

    // Ensure that the manager is trained or ready before tokenizing
    await manager.train();

    // Step 1: Tokenize the question
    const tokens = manager?.tokenizer?.tokenize(question);
    console.log(tokens)

    // Step 3: Perform named entity recognition (NER)
    const entities = manager?.entityRecognition(tokens);

    // Step 4: Classify the question type
    const questionType = classifyQuestion(entities);

    // Step 5: Search the scraped data for relevant information
    const relevantData = searchScrapedData(data, questionType, entities);

    // Step 6: Generate a response based on the retrieved information
    const response = generateResponse(relevantData, questionType);

    return response;
};

// Step 4: Question classification
const classifyQuestion = (entities) => {
    // Here, you classify the question based on entities or patterns
    if (entities.some(e => e.entity === 'person')) {
        return 'who';
    }
    if (entities.some(e => e.entity === 'date')) {
        return 'when';
    }
    if (entities.some(e => e.entity === 'location')) {
        return 'where';
    }
    // You can add more patterns for other question types
    return 'what';
};

// Step 5: Search the scraped data for relevant information
const searchScrapedData = (data, questionType, entities) => {
    let relevantData = '';

    switch (questionType) {
        case 'who':
            relevantData = data.find(item => item.includes(entities.find(e => e.entity === 'person').sourceText));
            break;
        case 'when':
            relevantData = data.find(item => item.includes(entities.find(e => e.entity === 'date').sourceText));
            break;
        case 'where':
            relevantData = data.find(item => item.includes(entities.find(e => e.entity === 'location').sourceText));
            break;
        default:
            relevantData = data.find(item => item.includes(entities[0]?.sourceText));
    }

    return relevantData || 'No relevant data found';
};

// Step 6: Generate a response based on the retrieved information
const generateResponse = (relevantData, questionType) => {
    if (!relevantData) {
        return 'Sorry, I couldn’t find any information.';
    }

    switch (questionType) {
        case 'who':
            return `The answer is: ${relevantData}`;
        case 'when':
            return `It happened on: ${relevantData}`;
        case 'where':
            return `The location is: ${relevantData}`;
        default:
            return `Here’s what I found: ${relevantData}`;
    }
};
