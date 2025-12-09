const fs = require('fs');
const csv = require('csv-parser');
const { Transform } = require('stream');
const Transaction = require('../models/Transaction');

/**
 * Create a transform stream to fix CSV headers on-the-fly
 */
function createCSVHeaderFixTransform() {
    let firstLine = true;
    let headerFixed = false;

    return new Transform({
        transform(chunk, encoding, callback) {
            let data = chunk.toString();

            if (firstLine) {
                firstLine = false;
                // Check if header needs fixing
                const lines = data.split('\n');
                if (lines[0].endsWith('Gender') && lines[1]?.startsWith(',Age')) {
                    // Fix the header
                    lines[0] = lines[0] + lines[1];
                    lines.splice(1, 1);
                    data = lines.join('\n');
                    headerFixed = true;
                }
            }

            callback(null, data);
        }
    });
}

/**
 * Import CSV data into MongoDB
 * @param {string} csvFilePath - Path to CSV file
 */
async function importCSV(csvFilePath) {
    const transactions = [];
    let rowCount = 0;

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                try {
                    rowCount++;

                    // Map CSV columns (with spaces) to schema fields
                    const transaction = {
                        transactionID: (row['Transaction ID'] || `TXN-${rowCount}`).toString(),
                        date: row['Date'] ? new Date(row['Date']) : new Date(),

                        // Customer fields
                        customerID: row['Customer ID'],
                        customerName: row['Customer Name'],
                        phoneNumber: row['Phone Number'],
                        gender: row['Gender'],
                        age: parseInt(row['Age']),
                        customerRegion: row['Customer Region'],
                        customerType: row['Customer Type'],

                        // Product fields
                        productID: row['Product ID'],
                        productName: row['Product Name'],
                        brand: row['Brand'],
                        productCategory: row['Product Category'],
                        tags: (row['Tags'] || '').split(',').map(t => t.trim()).filter(t => t),

                        // Sales fields
                        quantity: parseInt(row['Quantity']),
                        pricePerUnit: parseFloat(row['Price per Unit']),
                        discountPercentage: parseFloat(row['Discount Percentage'] || 0),
                        totalAmount: parseFloat(row['Total Amount']),
                        finalAmount: parseFloat(row['Final Amount']),

                        // Operational fields
                        paymentMethod: row['Payment Method'],
                        orderStatus: row['Order Status'],
                        deliveryType: row['Delivery Type'],
                        storeID: row['Store ID'],
                        storeLocation: row['Store Location'],
                        salespersonID: row['Salesperson ID'],
                        employeeName: row['Employee Name']
                    };

                    transactions.push(transaction);
                } catch (error) {
                    console.error('Error parsing row:', error.message);
                }
            })
            .on('end', async () => {
                try {
                    console.log(`Parsed ${transactions.length} transactions from CSV`);

                    // Clear existing data
                    await Transaction.deleteMany({});
                    console.log('Cleared existing transactions');

                    // Insert new data in batches
                    const batchSize = 1000;
                    let totalInserted = 0;
                    for (let i = 0; i < transactions.length; i += batchSize) {
                        const batch = transactions.slice(i, i + batchSize);
                        try {
                            const result = await Transaction.insertMany(batch, { ordered: false });
                            totalInserted += result.length;
                            console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${result.length} documents`);
                        } catch (batchError) {
                            console.error(`Batch ${Math.floor(i / batchSize) + 1} error:`, batchError.message);
                            throw batchError;
                        }
                    }

                    console.log(`✅ Successfully imported ${totalInserted} transactions`);
                    resolve(totalInserted);
                } catch (error) {
                    console.error('❌ Error inserting data:', error.message);
                    console.error('Stack:', error.stack);
                    reject(error);
                }
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error.message);
                reject(error);
            });
    });
}

module.exports = { importCSV };
