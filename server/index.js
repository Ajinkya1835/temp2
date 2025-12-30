
const app = require('./app');
const connectDB = require('./config/db');
const seedData = require('./seed');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Initialize Folders for Local Evidence Storage
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Start Server and Seed Database
connectDB().then(async () => {
  // Execute Seed Logic
  await seedData();

  app.listen(PORT, () => {
    console.log(`PVMS Enforcement Engine running on port ${PORT}`);
    console.log('READY – ALL SYSTEMS OPERATIONAL');
  });
});
