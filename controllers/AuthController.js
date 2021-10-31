const User = require("../models/User");

/* 처음 카카오 로그인 + 닉네임 수정 */ 

exports.saveUser = async function (req, res) {
    const { email, profileImage, accessToken } = req.body;
    const nickname="";
    
    // 1. 등록된 유저인지 확인 / 토큰 교체 
    
    try{
        let user = await User.findOne({ email: email });
        // 이미 등록되어 있으면 토큰 교체 후 해당 유저 정보를 갖고 메인으로 이동
        if(user){
            console.log("update before");
            const updateUser = await User.updateOne({email: email}, {accessToken: accessToken});  // 토큰 교체해주는 코드
            console.log(updateUser);
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

    // 2. 유저가 등록되어있지 않으면
    const user = new User({
        email,
        profileImage,
        accessToken,
        nickname
    });
    console.log("hi")
    console.log(user)

    try {
        await user.save(); // 등록되어있지 않은 유저인 경우 저장하고 닉네임 페이지로 이동
        console.log("save")
        return res
            .status(200)
            .json(user) // 새로운 유저를 등록
    } catch (err){
        console.log("catch")
        return res
            .status(500)
            .json({ error: err });
    } 
}

exports.saveNickname = async function (req, res) {
    const { email, nickName} = req.body;

    // 등록된 유저인지 확인 / 토큰 교체 
    try{

        // 1. 닉네임 중복처리
        let alreadyUsed = await User.findOne({ nickname: nickName }); // 입력한 닉네임이 이미 있는지 확인
        if(alreadyUsed){ 
            return res
                .status(409)  
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
