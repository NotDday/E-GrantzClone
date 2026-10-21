const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');

const dropOfficial = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/egrantz';

  try {
    const conn = await mongoose.connect(uri);
    console.log(`Connected to DB: ${conn.connection.host}`);

    const db = mongoose.connection.db;
    const collections = await db.listCollections({ name: 'official' }).toArray();

    if (collections.length === 0) {
      console.log('Result: Collection "official" does not exist.');
    } else {
      const count = await db.collection('official').countDocuments();
      if (count === 0) {
        await db.collection('official').drop();
        console.log('Result: Collection "official" had 0 documents and was dropped successfully.');
      } else {
        console.log(`Result: Collection "official" has ${count} document(s). Skipped dropping.`);
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Error in dropOfficial: ${error.message}`);
    process.exit(1);
  }
};

dropOfficial();
