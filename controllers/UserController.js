const Application = require("../models/Application");
const LikeStudy = require("../models/LikeStudy");
const RegisterApplication = require("../models/RegisterApplication");
const StudyList = require('../models/StudyModel');
const User = require("../models/User");

/* 마이페이지 화면 controller */ 

// 자신의 스터디 지원서 목록 조회
exports.showApplication = async function (req, res) {
    const { userId } = req.params;
    const { page } = req.query;

    // if (page < 1) 
    //     return res
    //         .status(400)
    //         .json({ error: err })
    
    try {
        const applications = await Application.find({userId:userId}) 
            // .sort({ applicationId : -1}) // 내림차순 정렬
            // .limit(5)
            // .skip((page - 1) * 5)
            // .exec();


        // const count = await Application.countDocuments().exec();
        // res.set('Last-Page', Math.ceil(count / 5 )); // 응답헤더를 설정 res.set(name, value)
        return res
            .status(200)
            .json(applications);
    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

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

// 찜한 스터디 조회
exports.likeStudyList = async function (req, res){
    const { userId } = req.params;
    try{
        var studyList=new Array();
        const likeStudyList = await LikeStudy.find({userId: userId}) // a가 찜한 스터디 목록 모두 담기
        console.log(likeStudyList.length)
        
        if(likeStudyList.length==0){ // 찜한 스터디가 없는 경우
            return res
                .status(200)
                .json({msg : '찜한 스터디가 없습니다'})
        }

        // objectId 받아서 studyList에서 다시 조회해오기
        for(var i=0;i<likeStudyList.length;i++){
            var study = await StudyList.findOne({_id : likeStudyList[i].study})
            studyList[i]=study;
        }
        
        return res
            .status(200)
            .json(studyList);

    } catch (err){
        throw res
            .status(500)
            .json({ error: err })       
    }
}

// 신청한 스터디 조회
exports.applyStudyList = async function (req, res){
    const { userId } = req.params;
    try{
        var studyAndApplication =new Array();
        const applyStudyList = await RegisterApplication.find({userId: userId}) // 등록지원서DB에서 userId에 해당하는 목록찾기
        var state = applyStudyList
        if(applyStudyList.length==0){ // 신청한 스터디가 없는 경우
            return res
                .status(200)
                .json({msg : '신청한 스터디가 없습니다'})
        }

        // objectId 받아서 studyList에서 다시 조회해오기
        for(var i=0;i<applyStudyList.length;i++){
            var study = await StudyList.findOne({_id : applyStudyList[i].study}) // 어떤 스터디인지
            var state = applyStudyList[i].state; // 스터디 등록 상태 (대기, 수락, 거절)
            var application = await Application.findOne({_id : applyStudyList[i].application}) // 해당스터디에 등록한 지원서

            const result = {
                studyId :study.StudyId,
                studyName : study.studyName,
                state,
                application
            }
            studyAndApplication[i]=result;
            console.log(studyAndApplication[i]);
        }
        console.log(studyAndApplication);

        return res
            .status(200)
            .json(studyAndApplication);

    } catch (err){
        throw res
            .status(500)
            .json({ error: err })       
    }
}

// 개설한 스터디 조회
exports.openedStudyList = async function (req, res){
    const { userId } = req.params;
    try{
        var openedAndApplication =new Array();
        const openedStudyList = await StudyList.find({userId: userId}) // a가 개설한 스터디 목록 모두 담기 a,b,c
        const user = await User.findOne({userId: userId}); // 열정온도 불러오기 위해서
        var temperature = user.temperature; // 열정온도

        if(openedStudyList.length==0){ // 개설한 스터디가 없는 경우
            return res
                .status(200)
                .json({msg : '개설한 스터디가 없습니다'})
        }
        
        for(var i=0;i<openedStudyList.length;i++){
            var application = await RegisterApplication.findOne({study : openedStudyList[i]._id})  // a가 개설한 스터디에 등록한 등록지원서 목록 가져오기
            openedAndApplication[i]={ 
                study:openedStudyList[i], // 개설한 스터디 정보
                application, // 그 스터디에 등록되어있는 지원서 목록
                temperature
            }
            console.log(openedAndApplication[i]);
        }
        
        return res
            .status(200)
            .json(openedAndApplication);

    } catch (err){
        throw res
            .status(500)
            .json({ error: err })       
    }
}

// 참여하고 있는 스터디 조회 
exports.ongoingStudyList = async function (req, res){
    const { userId } = req.params;
    try{
        var ongoingList =new Array();
        const registeredStudyList = await RegisterApplication.find({userId: userId, state:1}) // 유저가 등록한 지원서 중 수락완료된 지원서 목록
        
        if(registeredStudyList.length==0){ // 스터디 신청을 한 적이 없는 경우
            return res
                .status(200)
                .json({msg : '참여하는 스터디가 없습니다'})
        }

        for(var i=0;i<registeredStudyList.length;i++){
            var study = await StudyList.findOne({_id : registeredStudyList[i].study}) // 수락완료된 지원서에 해당하는 스터디 불러오기
            console.log(study); 
            ongoingList[i]=study;
        }
        return res
            .status(200)
            .json(ongoingList);

    } catch (err){
        throw res
            .status(500)
            .json({ error: err })       
    }
}


// 과제 관리
// router.get('/:userId/assignment', UserController.getAssignment);

