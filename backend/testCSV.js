const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const csvPath = path.join(__dirname, '..', 'frontend', 'src', 'assets', 'Constitution Of India.csv');
fs.createReadStream(csvPath)
    .pipe(csv())
    .on('headers', (headers) => {
        console.log("CSV Headers:", headers);
        process.exit();
    });
