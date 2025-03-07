const router = require('express').Router();

const Food = require('../models/foodModel');
const axios = require('axios');
const verifyToken = require('../verifyToken');
// get food item

router.get('/fooditem/:query', verifyToken, async (req, res) => {
    try {
        const food = req.params.query;
        const reqFood = await Food.find({ name: { $regex: food, $options: 'i' } });
        if (reqFood.length != 0) res.status(200).json(reqFood);
        else res.status(404).json("food item not found");

    } catch (error) {
        console.error('Error: ', error);
    }
});





module.exports = router;