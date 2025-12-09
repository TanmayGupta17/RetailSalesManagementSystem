const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const { importCSV } = require('../src/utils/csvImporter');

const CSV_FILE_PATH = path.join(__dirname, '../../truestate_assignment_dataset.csv');

async function main() {
    try {
        // Check if CSV file exists
        if (!fs.existsSync(CSV_FILE_PATH)) {
            throw new Error(`CSV file not found at: ${CSV_FILE_PATH}`);
        }
        console.log(`📄 CSV file found at: ${CSV_FILE_PATH}`);

        // Check MONGO_URL
        if (!process.env.MONGO_URL) {
            throw new Error('MONGO_URL environment variable is not set');
        }
        console.log('🔗 MONGO_URL loaded from .env');

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ Connected to MongoDB');

        // Drop the collection to clear any duplicate key errors
        try {
            await mongoose.connection.dropCollection('transactions');
            console.log('🗑️  Dropped existing transactions collection');
        } catch (err) {
            if (err.code === 26) {
                console.log('ℹ️  Collection does not exist, proceeding with import');
            } else {
                throw err;
            }
        }

        // Import CSV data
        console.log('Starting CSV import...');
        const count = await importCSV(CSV_FILE_PATH);
        console.log(`✅ Successfully imported ${count} transactions`);

        // Close MongoDB connection
        await mongoose.connection.close();
        console.log('✅ Closed MongoDB connection');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.connection.close().catch(() => { });
        process.exit(1);
    }
}

main();
