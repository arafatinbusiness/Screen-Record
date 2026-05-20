require('dotenv').config();
const fs = require('fs');
const pool = require('./index');

const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    const schema = fs.readFileSync(__dirname + '/schema.sql', 'utf8');
    
    // Execute the entire schema as a single query to handle dollar-quoted strings properly
    await pool.query(schema);
    
    console.log('Database initialized successfully');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initializeDatabase();
