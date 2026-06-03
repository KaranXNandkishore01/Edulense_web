const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Constitution = require('../models/Constitution');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edulense';
const OLLAMA_API = 'http://127.0.0.1:11434/api/embeddings';
const MODEL_NAME = 'nomic-embed-text'; // Must be pulled via `ollama pull nomic-embed-text`

async function getEmbedding(text) {
    try {
        const response = await fetch(OLLAMA_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                prompt: text
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status}`);
        }

        const data = await response.json();
        return data.embedding;
    } catch (err) {
        console.error('Error generating embedding:', err.message);
        return null;
    }
}

async function runTraining() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB.');

        const articles = await Constitution.find({});
        console.log(`Found ${articles.length} records. Starting embedding process...`);

        let count = 0;
        for (const article of articles) {
            if (article.embedding && article.embedding.length > 0) {
                // Skip if already embedded
                continue;
            }

            const textToEmbed = `${article.title}\n${article.content}`;
            const embedding = await getEmbedding(textToEmbed);

            if (embedding) {
                article.embedding = embedding;
                await article.save();
                count++;
                if (count % 10 === 0) {
                    console.log(`Embedded ${count} / ${articles.length} records...`);
                }
            }
        }

        console.log(`\n✅ Successfully generated and saved embeddings for ${count} records!`);
        process.exit(0);
    } catch (err) {
        console.error('Training failed:', err);
        process.exit(1);
    }
}

runTraining();
