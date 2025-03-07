const express = require('express');
const mongoose = require('mongoose');
const authRoute = require('./routes/Auth');
const foodRoute = require('./routes/Food');
const trackingRoute = require('./routes/Tracking');
const Food = require('./models/foodModel')
const dotenv = require('dotenv');
const fs = require('fs');
const cors = require('cors');


dotenv.config();
const app = express();
app.use(cors());
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("db connected");
        })

}




app.use(express.json());
app.use("/api/Auth", authRoute);
app.use("/api/Food", foodRoute);
app.use("/api/Tracking", trackingRoute);


app.listen(8000, () => {
    console.log("server running");
})
