const express = require('express');
const cors = require('cors');
const router = require('./routes');

const app = express();

app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.get("/", (req, res) => res.send("Aitherios API is running"));

module.exports = app;