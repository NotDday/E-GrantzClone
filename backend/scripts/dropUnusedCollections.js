const mongoose = require('mongoose');
require('dotenv').config();

const UNUSED_COLLECTIONS = [
  'official',
  'academicRecords',
  'castes',
  'payments'
];

async function dropUnusedCollections() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB\n');

    const db = mongoose.connection.db;

    for (const colName of UNUSED_COLLECTIONS) {
      const collections = await db.listCollections().toArray();
      const exists = collections.some(c => c.name === colName);

      if (exists) {
        try {
          await db.collection(colName).drop();
          console.log(`✓ Dropped collection: ${colName}`);
        } catch (err) {
          console.log(`✗ Failed to drop ${colName}: ${err.message}`);
        }
      } else {
        console.log(`○ Collection does not exist: ${colName}`);
      }
    }

    await mongoose.disconnect();
    console.log('\nDone.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

dropUnusedCollections();