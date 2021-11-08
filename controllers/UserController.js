const User = require("../models/User");

/* 마이페이지 화면 controller */ 

// 마이페이지에서 회원정보(닉네임) 수정
exports.editNickname = async function (req, res) {
    const { nickName } = req.body;
    const { userId } = req.params;
    
    try{
        let user = await User.findOne({ userId : userId }); // 유저번호에 해당하는 유저 있는지 찾고

        if(user){
            // 바꾸려는 닉네임이 중복된지 확인
            let alreadyUsed = await User.findOne({ nickname: nickName }); 
            if(alreadyUsed){ 
                return res
                    .status(409)  
                    .json({ error : '이미 사용 중인 닉네임입니다. '})
            }

            const editNickname = await User.updateOne({userId:userId}, {nickname: nickName}); 
            console.log(editNickname);
            user = await User.findOne({ userId : userId }); // 새로 업데이트된 유저 정보를 넘겨줌
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

// 찜한 스터디 
exports.likeStudyList = async function (req, res){

}

// // 찜한 스터디 조회
// router.get('/:userId/like-studylist', UserController.editUser)

// // 참여 스터디 조회 
// router.get('/:userId/total-studylist ', UserController.editUser)

// // 과제 관리
// router.get('/:userId/assignment', UserController.getAssignment);

// // 신청한 스터디 조회
// router.get('/:userId/apply-studylist', UserController.editUser)

// // 개설한 스터디 조회
// router.get('/:userId/opened-studylist', UserController.editUser)



// exports.showStudy = async function (req, res) {

// }