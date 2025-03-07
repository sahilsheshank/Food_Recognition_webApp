const router = require('express').Router();
const trackingModel = require('../models/trackingModel');
const verifyToken = require('../verifyToken');

//track a food item

router.post('/trackFood', verifyToken, async (req, res) => {
    const trackingData = req.body;
    try {
        const data = await trackingModel.create(trackingData);
        res.status(201).json("food item added");
    } catch (error) {
        res.status(404).json(error);
    }
})

//get all food of the user

router.get("/getfood/:userid/:date", async (req, res) => {
    let userid = req.params.userid;

    // Manually split the date and parse it as dd-mm-yyyy
    let [day, month, year] = req.params.date.split('-');

    // Ensure single-digit days and months are zero-padded correctly
    day = day.padStart(2, '0');
    month = month.padStart(2, '0');

    // Create a new Date object with correct formatting
    let strDate = `${day}/${month}/${year}`;
    // For debugging

    try {
        let foods = await trackingModel.find({ userId: userid, eatenDate: strDate })
            .populate('userId')
            .populate('foodId');
        res.send(foods);

    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Some Problem in getting the food" });
    }
});



module.exports = router;