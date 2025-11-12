// Script to clear MongoDB database
// Usage: node scripts/clear-database.js

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 
  `mongodb://${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || '27017'}/${process.env.DB_NAME || 'airbnb_db'}`;

async function clearDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    console.log(`\n⚠️  WARNING: This will delete the entire database: ${dbName}`);
    console.log('All data will be lost!\n');

    // Drop the database
    await db.dropDatabase();
    console.log(`✅ Database "${dbName}" has been deleted successfully!`);
    console.log('The database will be recreated automatically when services start.\n');

    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();

