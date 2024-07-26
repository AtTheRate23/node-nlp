const express = require('express');
const dotenv = require('dotenv');
const Routes = require('./routes/index.js');

dotenv.config();

const app = express();

app.use(express.json());


app.get('/', (req, res) => {
    res.status(200).json({
        message: 'NLP API is running'
    })
});

// Routes
app.use('/api', Routes)

// app listen

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));










