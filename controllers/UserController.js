const User = require("../models/User");
const path=require('path');

exports.saveUser = async function (req, res) {
    const { email, profileImage, accessToken } = req.body;

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
        return res
            .status(500)
            .json({ error: err })
    }
};

exports.saveNickname = async function (req, res) {
    const { email, nickname } = req.body;
  
    User.find({ email:email }, (err, users) => {
        if(err)
            return res
                .status(500)
                .json({ error: err })
        console.log(res.json(users));
    });

    /*
    if(email == 디비에 있고 디비에 nickname 값이 있는경우)
      메세지 리턴 
    else if email 디비에 있고 디비에 nickname 값 없는 경우 
        닉네임 추가
    else email 디비에 없는 경우 
     에러메세지 리턴
    */
    try {
        await user.save();
        return res
            .status(200)
            .json(user); // 위에서 담은 user 정보를 json형태로 보내면 const response에 들어감
    } catch (err) {
        return res.status(500).json({ error: err })
    }
};