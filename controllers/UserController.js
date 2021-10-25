const User = require("../models/User");
const path=require('path');

exports.saveUser = async function (req, res) {
    const { email, profileImage, accessToken } = req.body;
    console.log(req.body)
    console.log("hi")
    const user = new User({
        email,
        profileImage,
        accessToken
    })
    try {
        await user.save();
        return res
            .status(200)
            .json(user); // 위에서 담은 user 정보를 json형태로 보내면 const response에 들어감
    } catch (err) {
        return res.status(500).json({ error: err })
    }
};

