const mongoose = require('mongoose');
const Constitution = require('./models/Constitution');

mongoose.connect('mongodb://127.0.0.1:27017/edulense')
    .then(async () => {
        const parts = await Constitution.find({ type: 'part' });
        console.log(`Found ${parts.length} parts in the database.`);
        const allTypes = await Constitution.distinct('type');
        console.log(`Available types: ${allTypes.join(', ')}`);
        
        if (parts.length === 0) {
            console.log("No parts found. Checking first 3 entries:");
            const docs = await Constitution.find().limit(3);
            console.log(docs);
        }

        process.exit();
    });
