const mongoose = require('mongoose');

const foodSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    calories: {
        type: Number,
        required: true,
    },
    protein: {
        type: Number,
        required: true,
    },
    carbohydrates: {
        type: Number,
        required: true,
    },
    fat: {
        type: Number,
        required: true,
    },
    fibre: {
        type: Number,
        required: true,
    }

}, { timestamps: true })


const foodModel = mongoose.model("foods", foodSchema)

module.exports = foodModel;