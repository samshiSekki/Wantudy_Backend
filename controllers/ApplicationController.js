const User = require("../models/User");
const path=require('path');


exports.saveApplication = async function (req, res) {
    const { } = req.body;

    // 등록된 유저인지 확인 / 토큰 교체 
    try{

        // 1. 닉네임 중복처리
        let alreadyUsed = await User.findOne({ nickname: nickName }); // 입력한 닉네임이 이미 있는지 확인
        if(alreadyUsed){ 
            return res
                .status(204) //  204 error : Non Content, 클라이언트 요구를 처리했으나 전송할 데이터가 없음 
                .json({ error : '이미 사용 중인 닉네임입니다. '})
        }

        // 2. 이미 등록된 유저라면 토큰 교체 후 해당 유저 정보를 갖고 메인으로 이동
        let user = await User.findOne({ email: email }); // 해당 이메일을 가진 유저가 있는지 확인

        if(user){
            console.log("update before");
            const updateNickname = await User.updateOne({email: email}, {nickname: nickName});  // 토큰 교체해주면서 공백이었던 닉네임을 입력한 값으로 업데이트
            console.log(updateNickname);
            user = await User.findOne({ email: email }); // 새로 업데이트된 유저 정보를 넘겨줌
            console.log(user);        
            return res
                .status(200)
                .json(user); 
    
        }    
    } catch (err) {
        return res
            .status(500)
            .json({ error: err });
    } 
}