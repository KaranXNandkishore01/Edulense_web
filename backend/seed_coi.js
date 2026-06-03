const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Constitution = require('./models/Constitution');
const path = require('path');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edulense';
const CSV_FILE = path.join(__dirname, '../frontend/src/assets/Constitution Of India.csv');

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const parseCsv = () => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(CSV_FILE)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
};

const runSeeder = async () => {
    try {
        const data = await parseCsv();
        console.log(`Parsed ${data.length} rows from CSV`);

        // Wipe existing data
        await Constitution.deleteMany({});
        console.log('Cleared existing Constitution collection');

        const docsToInsert = [];
        let orderCounter = 1;
        let currentPart = '';

        for (const row of data) {
            // The column name is 'Articles' based on the first row
            const contentRaw = row['Articles'];
            if (!contentRaw || !contentRaw.trim()) continue;
            
            const contentStr = contentRaw.trim();
            const firstLine = contentStr.split('\n')[0].trim();
            
            let type = 'article';
            let title = firstLine;
            let articleNumber = '';

            // Check if it's a PART declaration
            const partMatch = firstLine.match(/^PART\s+([A-ZIVXLC]+)(.*)/i);
            if (partMatch) {
                type = 'part';
                currentPart = `PART ${partMatch[1].toUpperCase()}`;
                title = firstLine;
            } else {
                // Try to extract Article Number (e.g. "1. Name...", "2A. Sikkim...")
                const artMatch = firstLine.match(/^(\d+[A-Z]*)\.\s*(.*)/);
                if (artMatch) {
                    articleNumber = artMatch[1];
                    title = artMatch[2];
                } else if (firstLine.includes('SCHEDULE') || firstLine.includes('APPENDIX')) {
                     type = 'part';
                     currentPart = firstLine;
                }
            }

            docsToInsert.push({
                type,
                title: title.substring(0, 200), // Ensure title doesn't overflow reasonably
                part: currentPart,
                articleNumber,
                content: contentStr,
                order: orderCounter++
            });
        }

        await Constitution.insertMany(docsToInsert);
        console.log(`Successfully seeded ${docsToInsert.length} documents.`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

runSeeder();
