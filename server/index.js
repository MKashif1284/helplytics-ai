const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri || mongoUri === 'mongodb://127.0.0.1:27017/helplytics') {
    // Local development — try local then in-memory
    try {
      await mongoose.connect(mongoUri || 'mongodb://127.0.0.1:27017/helplytics', { serverSelectionTimeoutMS: 3000 });
      isConnected = true;
      console.log('✅ MongoDB connected (local)');
    } catch (err) {
      console.log('⚠️  Local MongoDB not available, starting in-memory server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      await mongoose.connect(mongod.getUri());
      isConnected = true;
      console.log('✅ MongoDB connected (in-memory)');
      console.log('🌱 Seeding database...');
      await require('./seedFn')();
      console.log('🌱 Seed complete!');
    }
  } else {
    // Production — use MongoDB Atlas
    try {
      await mongoose.connect(mongoUri, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      isConnected = true;
      console.log('✅ MongoDB connected (Atlas)');
    } catch (err) {
      console.error('❌ MongoDB Atlas failed:', err.message);
      throw err;
    }
  }
}

// DB connection middleware — MUST be before routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed', error: err.message });
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'Helplytics AI', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Seed endpoint
app.get('/api/seed', async (req, res) => {
  try {
    const User = require('./models/User');
    const count = await User.countDocuments();
    if (count > 0) return res.json({ message: 'Already seeded', users: count });
    await require('./seedFn')();
    res.json({ message: 'Database seeded successfully!' });
  } catch (err) {
    res.status(500).json({ message: 'Seed failed', error: err.message });
  }
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'Helplytics AI Backend API', status: 'running' });
});

// Local dev server
const PORT = process.env.PORT || 5000;
if (!process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  }).catch(err => {
    console.error('❌ Start error:', err.message);
    process.exit(1);
  });
}

module.exports = app;
