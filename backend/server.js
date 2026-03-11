require('dotenv').config();
console.log('MONGODB_URI:', process.env.MONGODB_URI); // add this line
const express = require('express');
const cors = require('cors');
const { initDb } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Init DB first, THEN register routes and start server
initDb().then(() => {
  const { router: authRouter } = require('./routes/auth');
  const listingsRouter = require('./routes/listings');

  app.use('/api/auth', authRouter);
  app.use('/api/listings', listingsRouter);

  app.use('/api/*', (_req, res) => {
    res.status(404).json({ error: 'API endpoint not found.' });
  });

  app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'An unexpected server error occurred.' });
  });

  app.listen(PORT, () => {
    console.log(`Travel Platform API running on http://localhost:${PORT}`);
  });

}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});