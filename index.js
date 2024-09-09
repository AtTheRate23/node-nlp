const express = require('express');
const dotenv = require('dotenv');
const Routes = require('./routes/index.js');
const ScrapRoutes = require('./routes/scrap.js')
const BotRoutes = require('./routes/bot.js')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
app.set('view engine', 'ejs');

// Add middleware to parse JSON bodies
app.use(bodyParser.json());

// Enable CORS

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

app.use(express.json());

// app.use('/audio', express.static(path.join(__dirname, 'generatedAudioFiles')));

app.get('/', (req, res) => {
    res.render('index', { transcription: null, audioUrl: null });
});

// app.get('/', (req, res) => {
//     res.status(200).json({
//         message: 'NLP API is running'
//     })
// });

// Routes
app.use('/api', Routes);
app.use('/scrap', ScrapRoutes);
app.use('/api', BotRoutes)

// app listen

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));










