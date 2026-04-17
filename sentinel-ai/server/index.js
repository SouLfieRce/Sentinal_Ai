const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const analyzeRoute = require('./routes/analyze');
const chatRoute = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'SENTINEL AI Online', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/analyze', analyzeRoute);
app.use('/api/chat', chatRoute);

app.listen(PORT, () => {
  console.log(`\n⚡ SENTINEL AI Server running on port ${PORT}`);
  console.log(`🛡️  API: http://localhost:${PORT}/api/health\n`);
});
