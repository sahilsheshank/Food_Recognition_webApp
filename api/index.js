const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/Auth');
const foodRoute = require('./routes/Food');
const trackingRoute = require('./routes/Tracking');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Open CORS — allow all origins (frontend on Vercel, local dev, etc.)
app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection (reused across requests)
let isConnected = false;
async function connectDB() {
    if (isConnected) return;
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log('MongoDB connected');
}

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('DB connection error:', err);
        res.status(500).json({ message: 'Database connection failed' });
    }
});

app.use("/api/Auth", authRoute);
app.use("/api/Food", foodRoute);
app.use("/api/Tracking", trackingRoute);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Always start server — works on Render, Railway, local dev
// Render injects process.env.PORT automatically
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Also export for any serverless use
module.exports = app;
