const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const requestRoutes = require('./routes/requests');
const messageRoutes = require('./routes/messages');
const notificationRoutes = require('./routes/notifications');
const aiRoutes = require('./routes/ai');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'Helplytics AI' });
});

// Seed endpoint — hit once after deploy to populate Atlas DB
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

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Helplytics AI Backend API', status: 'running' });
});

const PORT = process.env.PORT || 5000;

// MongoDB connection with retry
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  let mongoUri = process.env.MONGODB_URI;

  if (mongoUri && mongoUri !== 'mongodb://127.0.0.1:27017/helplytics') {
    // Production — use real MongoDB (Atlas)
    try {
      await mongoose.connect(mongoUri);
      isConnected = true;
      console.log('✅ MongoDB connected (Atlas)');
    } catch (err) {
      console.error('❌ MongoDB Atlas connection failed:', err.message);
    }
  } else {
    // Local development — try local then in-memory
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
      isConnected = true;
      console.log('✅ MongoDB connected (local)');
    } catch (err) {
      console.log('⚠️  Local MongoDB not available, starting in-memory server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      mongoUri = mongod.getUri();
      await mongoose.connect(mongoUri);
      isConnected = true;
      console.log('✅ MongoDB connected (in-memory)');

      // Auto-seed the database
      console.log('🌱 Seeding database...');
      await require('./seedFn')();
      console.log('🌱 Seed complete!');
    }
  }
}

// For Vercel serverless — connect before each request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Start server (local dev only, Vercel handles this in production)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Helplytics AI server running on port ${PORT}`);
    });
  }).catch(err => {
    console.error('❌ Server start error:', err.message);
    process.exit(1);
  });
}

// Export for Vercel
module.exports = app;
