const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// register user
router.post('/register', async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            age: req.body.age,
        });

        res.status(200).json("User Registered");
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong", error });
    }
});

// login user

router.post("/login", async (req, res) => {
    try {
        const userCred = req.body;
        const user = await User.findOne({ email: req.body.email });
        if (user != null) {
            bcrypt.compare(userCred.password, user.password, (err, success) => {
                if (success == true) {
                    jwt.sign({ email: userCred.email }, "nutrifyapp", (err, token) => {
                        if (!err) {
                            res.send({ message: "Login Success", token: token, userid: user._id, name: user.name });
                        }
                    })
                }
                else {
                    res.status(403).send({ message: "Incorrect password" })
                }
            });

        }
        else {
            res.status(404).json("user not found");
        }

    } catch (err) {
        console.log(err);
    }
})

//post user Data

router.put("/userData/:userid", async (req, res) => {
    let userid = req.params.userid;
    const { weight, goalWeight, height, gender, activity } = req.body;

    try {
        const user = await User.findOne({ _id: userid });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update user data
        user.userData = { weight, goalWeight, height, gender, activity };

        // Save changes
        await user.save();

        res.status(200).json({ message: "Data added successfully" });

    } catch (error) {
        res.status(500).json({ message: "Error updating user data", error });
    }
});

//get user data

router.get("/getData/:userid", async (req, res) => {
    let userid = req.params.userid;

    try {
        const user = await User.findOne({ _id: userid });
        if (!user) {
            res.status(404).send("user not found");
        }
        else {
            const data = await user.userData;
            res.send({ data });
        }
    } catch (error) {
        res.status(500).send(error);
    }
})
module.exports = router;