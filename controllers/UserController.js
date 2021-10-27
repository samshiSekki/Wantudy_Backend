const User = require("../models/User");
const path=require('path');

exports.saveUser = async function (req, res) {
    const { email, profileImage, accessToken } = req.body;

    // 로그인 시 이미 등록된 유저인지 확인하고 토큰 교체 ( 토큰 교체는 처리 해줘야 함)
    User.find({ email:email }, (err, users) => {
        if(err)
            return res
                .status(500)
                .json({ error: err })
        else if(users){ // 이미 등록되어 있으면 해당 유저 정보를 갖고 메인으로 이동
            return res
                .status(200)
                .json({users})
        }    
    });

    const user = new User({
        email,
        profileImage,
        accessToken
    })    

    try {
        await user.save(); // 등록되어있지 않은 유저인 경우 저장하고 닉네임 페이지로 이동

        return res
            .status(200)
            .json(user); // 위에서 담은 user 정보를 json형태로 보내면 const response에 들어감
    } catch (err) {
        return res
            .status(500)
            .json({ error: err })
    }
};

