const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// register user
router.post('/register', async (req, res) => {
    const newUser = await User.findOne({email:req.body.email});
    if (newUser!=null) {
        res.json("user already exists");
    }
    else {
        try {

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const newUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                age: req.body.age,
            })
            const user = await newUser.save()
            res.status(200).json("User Registered");
        } catch (error) {
            console.log(error);
        }
    }

})

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

module.exports = router;