const express = require('express');
const dotenv = require('dotenv');
const Routes = require('./routes/index.js');
const path = require('path')
const cors = require('cors')

dotenv.config();

const app = express();

// Enable CORS

app.use(cors());

app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({
        message: 'NLP API is running'
    })
});

// Routes
app.use('/api', Routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// app listen

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));










