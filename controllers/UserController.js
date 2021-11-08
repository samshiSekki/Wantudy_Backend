const Application = require("../models/Application");
const LikeStudy = require("../models/LikeStudy");
const RegisterApplication = require("../models/RegisterApplication");
const StudyList = require('../models/StudyModel');
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
        
        if(openedStudyList.length==0){ // 개설한 스터디가 없는 경우
            return res
                .status(200)
                .json({msg : '개설한 스터디가 없습니다'})
        }

        for(var i=0;i<openedStudyList.length;i++){
            var application = await RegisterApplication.find({study : openedStudyList[i]._id}) // a가 개설한 스터디에 등록한 등록지원서 목록 가져오기
                        
            openedAndApplication[i]={ 
                study:openedStudyList[i], // 개설한 스터디 정보
                application // 그 스터디에 등록되어있는 지원서 목록
            }
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

// 참여 스터디 조회 
// router.get('/:userId/total-studylist ', UserController.editUser)

// 과제 관리
// router.get('/:userId/assignment', UserController.getAssignment);

