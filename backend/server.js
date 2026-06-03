const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const highlightRoutes = require('./routes/highlights');
const quizRoutes = require('./routes/quizzes');
const constitutionRoutes = require('./routes/constitution');
const feedbackRoutes = require('./routes/feedback');
const progressRoutes = require('./routes/progress');
const nlpModel = require('./utils/nlpModel');
const path = require('path');


const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));




// Routes
app.use('/api/auth', authRoutes);
app.use('/api/highlights', highlightRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/constitution', constitutionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/progress', progressRoutes);


// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edulense';

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
        const csvPath = path.join(__dirname, '../frontend/src/assets/Constitution Of India.csv');
        await nlpModel.init(csvPath);
    } catch (err) {
        console.error('Failed to initialize NLP model:', err);
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
