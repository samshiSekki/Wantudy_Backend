const User = require("../models/User");
const path=require('path');

//StudyList에 document 저장
exports.saveUser = async function (req, res) {
    const { email, profileImage } = req.body;
    console.log(req.body)
    const user = new User({
        email,
        profileImage
    })
    try {
        await user.save();
        return res
            .status(200)
            .json(user);
    } catch (err) {
        return res.status(500).json({ error: err })
    }
};

