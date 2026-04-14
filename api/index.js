const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/Auth');
const foodRoute = require('./routes/Food');
const trackingRoute = require('./routes/Tracking');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Allow requests from the Vercel frontend domain and localhost
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB (reuse existing connection in serverless)
let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log('db connected');
}

// Middleware to ensure DB connection on each serverless invocation
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

app.use("/api/Auth", authRoute);
app.use("/api/Food", foodRoute);
app.use("/api/Tracking", trackingRoute);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Start local server only in development
if (process.env.NODE_ENV !== 'production') {
    app.listen(8001, () => console.log('Server running on http://localhost:8001'));
}

// Export for Vercel serverless
module.exports = app;
