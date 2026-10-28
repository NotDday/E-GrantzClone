const mongoose = require('mongoose');
require('dotenv').config();

const ACTIVE_COLLECTIONS = [
  'users',
  'students',
  'schemes',
  'institutions',
  'courses',
  'districts',
  'applications',
  'notices',
  'contacts',
  'counters'
];

async function listCollections() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    console.log('\n=== All Collections in Atlas DB ===\n');
    collections.forEach(col => {
      const isActive = ACTIVE_COLLECTIONS.includes(col.name);
      console.log(`${isActive ? '✓' : '✗'} ${col.name}`);
    });

    const unused = collections.filter(c => !ACTIVE_COLLECTIONS.includes(c.name));
    if (unused.length > 0) {
      console.log('\n=== Unused Collections (Not in 10 active models) ===\n');
      unused.forEach(c => console.log(`  - ${c.name}`));
    }

    await mongoose.disconnect();
    console.log('\nDone.');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listCollections();