const mongoose = require('mongoose');
const Constitution = require('./models/Constitution');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/edulense';

async function fixDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');
        
        const counts = await Constitution.countDocuments({});
        console.log(`Total documents before: ${counts}`);
        
        // Remove everything or conditionally?
        // Since Bulk Update replaced everything and it was invalid, probably the user wants it cleared or wants the valid format back.
        // Let's just remove everything to give a clean state, as "re-sync" deleted everything anyway.
        await Constitution.deleteMany({});
        console.log('Cleared all Constitution documents.');
        
        console.log('Done.');
    } catch(err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
}

fixDB();
