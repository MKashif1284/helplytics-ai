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

const PORT = process.env.PORT || 5000;

async function startServer() {
  let mongoUri = process.env.MONGODB_URI;

  try {
    // Try connecting to local MongoDB first
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ MongoDB connected (local)');
  } catch (err) {
    console.log('⚠️  Local MongoDB not available, starting in-memory server...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected (in-memory)');

    // Auto-seed the database
    console.log('🌱 Seeding database...');
    await require('./seedFn')();
    console.log('🌱 Seed complete!');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Helplytics AI server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('❌ Server start error:', err.message);
  process.exit(1);
});
