const Application = require("../models/Application");
const Assignment = require("../models/Assignment");
const LikeStudy = require("../models/LikeStudy");
const RegisterApplication = require("../models/RegisterApplication");
const StudyList = require('../models/StudyModel');
const User = require("../models/User");
const RegisterAssignment = require("../models/RegisterAssignment");
const { scheduleSave } = require("./ScheduleController");
const logger = require('../.config/winston');

/* 마이페이지 화면 controller */

// 유저 정보 조회
exports.showUser = async function (req, res) {
    const { userId } = req.params;

    try {
        const user = await User.find({ userId: userId });
        console.log(user);
        return res
            .status(200)
            .json(user);
    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 자신의 스터디 지원서 목록 조회
exports.showApplication = async function (req, res) {
    const { userId } = req.params;
    const { page } = req.query;

    // if (page < 1) 
    //     return res
    //         .status(400)
    //         .json({ error: err })

    try {
        const applications = await Application.find({ userId: userId })
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

    try {
        let user = await User.findOne({ userId: userId }); // 유저번호에 해당하는 유저 있는지 찾고

        if (user) {
            // 바꾸려는 닉네임이 중복된지 확인
            let alreadyUsed = await User.findOne({ nickname: nickName });
            if (alreadyUsed) {
                return res
                    .status(409)
                    .json({ error: '이미 사용 중인 닉네임입니다. ' })
            }

            const editNickname = await User.updateOne({ userId: userId }, { nickname: nickName });
            console.log(editNickname);
            user = await User.findOne({ userId: userId }); // 새로 업데이트된 유저 정보를 넘겨줌
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
exports.likeStudyList = async function (req, res) {
    const { userId } = req.params;
    try {
        var studyList = new Array();
        const likeStudyList = await LikeStudy.find({ userId: userId }) // a가 찜한 스터디 목록 모두 담기
        console.log(likeStudyList.length)

        if (likeStudyList.length == 0) { // 찜한 스터디가 없는 경우
            return res
                .status(200)
                .json({ msg: '찜한 스터디가 없습니다' })
        }

        // objectId 받아서 studyList에서 다시 조회해오기
        for (var i = 0; i < likeStudyList.length; i++) {
            var study = await StudyList.findOne({ _id: likeStudyList[i].study })
            studyList[i] = study;
        }

        return res
            .status(200)
            .json(studyList);

    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 신청한 스터디 조회
exports.applyStudyList = async function (req, res) {
    const { userId } = req.params;
    try {
        var studyAndApplication = new Array();
        const applyStudyList = await RegisterApplication.find({ userId: userId }) // 등록지원서DB에서 userId에 해당하는 목록찾기
        if (applyStudyList.length == 0) { // 신청한 스터디가 없는 경우
            return res
                .status(200)
                .json({ msg: '신청한 스터디가 없습니다' })
        }
        console.log(applyStudyList.length)
        // objectId 받아서 studyList에서 다시 조회해오기
        for (var i = 0; i < applyStudyList.length; i++) {
            console.log(i)
            console.log(applyStudyList[i])
            var study = await StudyList.findOne({ _id: applyStudyList[i].study }) // 어떤 스터디인지
            console.log(study)
            var state = applyStudyList[i].state; // 스터디 등록 상태 (대기, 수락, 거절)
            var application = await Application.findOne({ _id: applyStudyList[i].application }) // 해당스터디에 등록한 지원서
            
            console.log(application)
            if(!application)
                return res
                .status(404)
                .end()

            const result = {
                studyId: study.StudyId,
                studyName: study.studyName,
                state,
                application
            }
            studyAndApplication[i] = result;
        }
        console.log("hi"+studyAndApplication);

        return res
            .status(200)
            .json(studyAndApplication);

    } catch (err) {
        logger.error("신청한 스터디 error : " + err)
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 신청한 스터디 신청 취소
exports.cancelStudy = async function (req, res) {
    const { userId, applicationId } = req.params;
    try{
        const application = await Application.findOne({applicationId : applicationId})
        await RegisterApplication.findOneAndDelete({ application: application._id})
        return res
            .status(200)
            .json({msg : '스터디 신청이 취소되었습니다'})
    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })    
    }
}

// 개설한 스터디 조회
exports.openedStudyList = async function (req, res) {
    const { userId } = req.params;
    try {
        var openedAndApplication = new Array();
        const openedStudyList = await StudyList.find({ userId: userId }) // a가 개설한 스터디 목록 모두 담기 a,b,c
        console.log(openedStudyList.length) // 2

        if (openedStudyList.length == 0) { // 개설한 스터디가 없는 경우
            return res
                .status(200)
                .json({ msg: '개설한 스터디가 없습니다' })
        }

        for (var i = 0; i < openedStudyList.length; i++) { // a가 개설한 스터디 목록을 모두 돌면서
            var study = openedStudyList[i];
            var applicationObject = await RegisterApplication.find({ study: study._id }).exec()  // a가 개설한 스터디에 등록한 등록지원서 목록 가져오기
            if (applicationObject.length == 0) { // 스터디에 등록된 지원서가 없는 경우
                openedAndApplication[i] = {
                    study: openedStudyList[i], // 개설한 스터디 정보
                    applications: [null]
                }
            }
            else {
                var info = new Array()
                for (var j = 0; j < applicationObject.length; j++) {
                    console.log(j)
                    var user = await User.findOne({ userId: applicationObject[j].userId }); // 열정온도 불러오기 위해서 유저부터 가져옴 (등록된 지원서에서)
                    console.log(user)
                    var temperature = user.temperature; // 지원자의 열정온도
                    var application = await Application.findOne({_id: applicationObject[j].application}) // 지원서
                    var user = await User.findOne({userId: applicationObject[j].userId}) // 유저 프로필 사진
                    var profileImage = user.profileImage; // 유저 프로필 사진
                    var nickname= user.nickname; // 유저 닉네임
                    var message = await applicationObject[j].message // 지원자가 등록한 메세지
                    var state = await applicationObject[j].state // 수락된 상태인지 아닌지 보여주기
                    console.log(profileImage)

                    if(!application){
                       continue;
                    }
                    var registered = await applicationObject[j].registered // 지원서 등록시기
                    console.log(registered)
                    info[j] = {
                        profileImage, // 등록한 사람 프사
                        nickname, // 등록한 사람 닉네임
                        application, // 등록한 지원서
                        temperature, // 등록한 지원자 온도
                        message, // 스터디장에게 한마디 
                        registered, // 
                        state // 지원서 수락 여부 
                    } 
                    console.log("hi"+info[j])
                }
                openedAndApplication[i] = {
                    study: openedStudyList[i], // 스터디 1개당 지원서 여러개 넣기 위해 이렇게 구조 짬
                    applications: info
                }
                console.log(openedAndApplication[i]);
            }
        }

        return res
            .status(200)
            .json(openedAndApplication);

    } catch (err) {
        logger.error("개설한 스터디 error : " + err)
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 개설한 스터디에서 스터디 시작하기
exports.startStudy = async function (req, res) {
    const { userId, studyId } = req.params;
    try {
        await StudyList.findOneAndUpdate({ StudyId:studyId }, {
            $set: {
                state: 1
            }
        }, { new: true });

        return res
            .status(200)
            .json({msg : '스터디가 시작되었습니다'});
    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 참여 스터디에서 스터디 종료하기
exports.endStudy = async function (req, res) {
    const { userId, studyId } = req.params;
    try {
        await StudyList.findOneAndUpdate({ StudyId:studyId }, {
            $set: {
                state: 2
            }
        }, { new: true });

        return res
            .status(200)
            .json({msg : '스터디가 종료되었습니다'});
    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 개설한 스터디 상세보기 지원서 조회 - 스터디원 수락/거절 
exports.manageMember = async function (req, res) {
    const { userId, applicationId } = req.params;
    const { choice, studyId } = req.body;
    // applicationId를 받아서 applications에 있는 _id를 가져오고 그게 Register applicationId랑 같은지
    try {
        const study = await StudyList.findOne({ StudyId: studyId }) // 개설한 스터디 가져오기 
        var peopleNum = study.peopleNum; // 스터디 총 인원
        var currentNum = study.currentNum; // 스터디 현재 등록된 인원
        const application = await Application.findOne({ applicationId: applicationId })

        var result;

        if (choice == "수락") { // 스터디장이 수락한 경우
            // 해당 스터디번호에 맞는 지원서를 찾고 state=1 (수락)으로 만들어줌
            if (peopleNum == currentNum)
                return res
                    .status(200)
                    .json({ msg: '더이상 수락할 수 없습니다.' })

            result = await RegisterApplication.findOne({study: study._id, application: application._id})
            if(result.state==1)
                return res
                    .status(200)
                    .json({ msg: '이미 수락한 지원서입니다' })

            result = await RegisterApplication.findOneAndUpdate({ study: study._id, application: application._id }, {
                $set: {
                    state: 1
                }
            }, { new: true }).exec();

            // 수락한 경우 currentNum 증가
            await StudyList.findOneAndUpdate({ _id: study._id }, {
                $set: {
                    currentNum: currentNum + 1
                }
            }, { new: true }).exec();

            if (!result) {
                return res
                    .status(400)
                    .json({ error: err })
            }
        } else if (choice == "거절") { // 스터디장이 거절한 경우
            // 원래 state=1 이었는지 확인하고 
            const apply = await RegisterApplication.findOne({ study: study._id, application: application._id });
            console.log(apply)
            // 수락했다가 거절한 경우 currentNum 감소
            if(apply.state == 1){
                await StudyList.findOneAndUpdate({ _id: study._id }, {
                    $set: {
                        currentNum: currentNum - 1
                    }
                }, { new: true }).exec();
            }

            // 해당 스터디번호에 맞는 지원서를 찾고 state=2 (거절)로 만들어줌
            result = await RegisterApplication.findOneAndUpdate({ study: study._id, application: application._id }, {
                $set: {
                    state: 2
                }
            }, { new: true });            

            if (!result) {
                return res
                    .status(400)
                    .json({ error: err })
            }
        }
        return res
            .status(200)
            .json({msg: `스터디원을 ${choice}했습니다`});

    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 참여 스터디 조회
exports.ongoingStudyList = async function (req, res){
    const { userId } = req.params;
    try{
        var ongoingList = new Array();
        const openedStudyList = await StudyList.find({userId: userId, state:1}) // a가 개설한 스터디했고 시작된 스터디 목록
        console.log(openedStudyList)
        const participated = await RegisterApplication.find({userId: userId, state:1}) 
        console.log("pp"+participated)
        // 유저가 등록한 지원서 중 수락완료된 지원서 목록이 등록된 스터디 목록 (이게 없으면 지원도 안한거니까 스터디원으로 참여하는 게 없음)
        var participatedStudyList = new Array()

        // console.log("hi:"+participated[0].study)
        // 스터디원으로 참여하는 스터디 정보 가져오기 
        for(var i=0;i<participated.length;i++){
            participatedStudyList[i] = await StudyList.findOne({_id:participated[i].study})
            console.log(participatedStudyList[i])
        }
        console.log("참여하는 스터디 "+participatedStudyList)

        console.log(openedStudyList.length)
        console.log(participatedStudyList.length)

        if(participatedStudyList.length==0 && openedStudyList.length==0){ // 스터디 신청x + 개설x 인 경우
            return res
                .status(200)
                .json({ msg: '참여하는 스터디가 없습니다' })
        }

        // 1. 개설한 스터디
        var openedStudy = new Array();
        for(var i=0;i<openedStudyList.length;i++){ // studylists 모델의 여러 개 가져온 것 _ 해당 사람이 개설한 스터디 
            // 참여자 목록
            var members = new Array();
            const member = await RegisterApplication.find({study:openedStudyList[i]._id, state:1},{userId:1}) // 등록된 지원서 중 해당 스터디에 해당하며, 수락된 userId 목록찾기
           
            for(var j=0;j<member.length;j++){
                const user = await User.findOne({userId:member[j].userId}, {_id:0, userId:1, profileImage:1, nickname:1})
                members[j]=user
                
            }
            // 스터디장도 추가
            const studyManager = await User.findOne({userId:userId}, {_id:0, userId:1, profileImage:1, nickname:1})
            members[j]=studyManager
            console.log("멤버"+members);

            // 확정된 일정
            var schedule;
            if(!openedStudyList[i].commonSchedule)
                schedule=null;
            else
                schedule = openedStudyList[i].commonSchedule
                
            // 해야 할 과제
            var assignedState=true
            var todoAssignment = new Array()
            var assignment =await Assignment.find({studyId: openedStudyList[i].StudyId}); // 현 스터디에 부여된 과제 목록 (해야 할 과제)
            console.log("해야할 과제"+assignment)
            if(!assignment)
                assignment = '해야 할 과제가 없습니다'

            for(var j=0;j<assignment.length;j++){
                // 과제 완료 여부 추가
                // console.log(assignment[j]);
                const study = await StudyList.findOne({StudyId : assignment[j].studyId}); // 스터디             
                const assign = await Assignment.findOne({studyId: assignment[j].studyId}) // 스터디에서 부여한 과제
               
                // console.log(openedStudyList[i].peopleNum);
                const assignedOrNot = await RegisterAssignment.findOne({userId: userId, assignmentId:assign.assignmentId}) // 내가 과제를 제출했는지 여부
                console.log(assignedOrNot)

                if(!assignedOrNot) // 제출하지 않았다면
                    assignedState=false;
                else
                    assignedState=true;

                console.log(assignedOrNot)
                const todo={
                    assignment: assignment[j],
                    checked:[assign.currentNum, study.currentNum], // 2/4명 완료
                    assignedOrNot:assignedState
                }
                todoAssignment[j]=todo;
            }

            // 관리 할 과제            
            var manageAssignment = await RegisterAssignment.find({studyId: openedStudyList[i].StudyId}) // 등록된 과제 중에서 해당 스터디에 해당하는 것
            if(!manageAssignment)
                manageAssignment = '관리 할 과제가 없습니다'

            const study = { 
                studyInfo : openedStudyList[i], // 스터디정보
                participants : members, // 참여자 
                schedule: schedule, // 일정 조율
                todoAssignment : todoAssignment, // 해야 할 과제
                manageAssignment: manageAssignment, // 관리 할 과제
                studyState: openedStudyList[i].state // 스터디 종료 여부
            }
            
            openedStudy[i]=study            
        }

        
        // 2. 참여하는 스터디  participatedStudyList 3번이라는 사람이 참여하는 스터디 목록 돌면서
        var participatedStudy = new Array();
        console.log(participatedStudyList.length)
        // console.log(participatedStudyList[0])
        for(var i=0;i<participatedStudyList.length;i++){ // 참여하는 스터디 목록 돌면서
            console.log("hiiiiiiiiiii");

            // 참여자 목록
            var members = new Array();
            const member = await RegisterApplication.find({study:participatedStudyList[i]._id, state:1},{userId:1}) // 등록된 지원서 중 해당 스터디에 해당하며, 수락된 userId 목록찾기
            console.log(member)
            if(!member)
                console.log("없음")
            for(var j=0;j<member.length;j++){
                const user = await User.findOne({userId:member[j].userId}, {_id:0, userId:1, profileImage:1, nickname:1})
                members[j]=user
            }

            //스터디장도 추가 
            const studyManager = await User.findOne({userId:participatedStudyList[i].userId},{_id:0, userId:1, profileImage:1, nickname:1})
            members[j]=studyManager
            console.log("참여스터디인원"+members);

            //확정된 일정
            var schedule;
            if(!participatedStudyList[i].commonSchedule)
                schedule = null;
            else
                schedule = participatedStudyList[i].commonSchedule

            // 해야 할 과제
            var assignedState=true
            var todoAssignment = new Array()
            var assignment =await Assignment.find({studyId: participatedStudyList[i].StudyId}); // 현 스터디에 부여된 과제 목록 (해야 할 과제)
            console.log("해야할 과제"+assignment)
            if(!assignment)
                assignment = '해야 할 과제가 없습니다'

            for(var j=0;j<assignment.length;j++){
                // 과제 완료 여부 추가
                // console.log(assignment[j]);
                const study = await StudyList.findOne({StudyId : assignment[j].studyId}); // 스터디             
                const assign = await Assignment.findOne({studyId: assignment[j].studyId}) // 스터디에서 부여한 과제
            
                // console.log(openedStudyList[i].peopleNum);
                const assignedOrNot = await RegisterAssignment.findOne({userId: userId, assignmentId:assign.assignmentId}) // 내가 과제를 제출했는지 여부
                console.log(assignedOrNot)

                if(!assignedOrNot) // 제출하지 않았다면
                    assignedState=false;
                else
                    assignedState=true;

                console.log(assignedOrNot)
                const todo={
                    assignment: assignment[j],
                    checked:[assign.currentNum, study.currentNum], // 2/4명 완료
                    assignedOrNot:assignedState
                }
                todoAssignment[j]=todo;
            }

            const study = {
                studyInfo : participatedStudyList[i], // 스터디정보
                participants: members, // 스터디 참여자
                schedule: schedule, // 일정 조율
                todoAssignment: todoAssignment, // 해야 할 과제
                studyState: participatedStudyList[i].state // 스터디 종료 여부
            } 
            participatedStudy[i]=study            
        }

        ongoingList={
            studyManager : openedStudy,
            studyMember : participatedStudy
        }

        console.log(ongoingList)
        return res
            .status(200)
            .json(ongoingList);

    } catch (err) {
        logger.error("참여 스터디 error : " + err)
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 과제 부여
// router.post('/:userId/ongoing-studylist/:studyId/giveAssignment', UserController.giveAssignment)
exports.giveAssignment = async function (req, res) {
    const { userId, studyId} = req.params;
    const { assignmentName, assignment, deadline } = req.body; 

    study = await StudyList.findOne({StudyId:studyId})

    try{
        const todo = new Assignment({
            userId,
            studyId,
            studyName:study.studyName,
            assignmentName,
            assignment,
            deadline
        })
        await todo.save();

        return res
            .status(200)
            .json(todo);
    } catch (err) {
        logger.error("과제 부여 error : " + err)
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 과제 완료 체크
exports.checkAssignment = async function (req, res) {
    const { userId, studyId, assignmentId } = req.params;
    
    // 과제 완료 체크하면 currentNum 체크 해야 됨  (현재 과제 제출한 인원 / 스터디참여 인원)
    const studyMember = await StudyList.findOne({StudyId : studyId}, {_id:0, currentNum:1}); // 스터디 참여 인원
    console.log(studyMember)
    // const checkedMember = await Assignment.findOne({assignmentId:assignmentId}, {_id:0, currentNum}); // 현재 과제 제출 인원

    try{
        const check = new RegisterAssignment({
            userId, 
            studyId,
            assignmentId
        })
        await check.save(); // 제출한 과제 DB에 저장 

        const checkedMember = await Assignment.findOneAndUpdate({assignmentId:assignmentId},{
            $inc:{
                currentNum:1
            }
        }); // 제출 인원 늘려주기
        console.log(checkedMember)

        return res
            .status(200)
            .json(check);
    } catch (err) {
        logger.error("과제 완료 체크 error : " + err)
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 과제 완료자 조회 
// router.get('/:userId/ongoing-studylist/:studyId/showAssignment/:assignmentId', UserController.showAssignment)
exports.showAssignment = async function (req, res) {
    const { userId, studyId, assignmentId } = req.params;
    try{
        const assignedUsers = await RegisterAssignment.find({assignmentId:assignmentId}) // 내가 과제를 제출했는지 여부
        var assigned = new Array()
        for(var i=0;i<assignedUsers.length;i++){
            const user = await User.findOne({userId: assignedUsers[i].userId})
            console.log(user)
            assigned[i]=user.nickname;
        }
        console.log(assigned);

        return res
            .status(200)
            .json({
                assignedMember:assigned
            });
    } catch (err) {
        logger.error("과제 완료자 조회 error : " + err)
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 열정 평가
exports.passionTest = async function (req, res) {
    const { userId, studyId, memberId } = req.params;
    const { positive, negative } = req.body;
    try{
        await User.findOneAndUpdate({userId:memberId},{
            $inc:{
                temperature: positive+negative*(-1)
            }
        },{new:true}); // 상대방 온도 조정

        // 스터디원으로 참여하는 경우 state=3으로 바꿈 (스터디종료)
        const study = await StudyList.findOne({StudyId: studyId}); // 스터디찾기  
        

        if(study.userId == userId){ // 스터디장인 경우
            // 스터디장으로 참여하는 경우 스터디 상태를 종료로 바꿈
            await StudyList.findOneAndUpdate({StudyId : studyId}, {
                $set: {
                    state:2
                }
            }, {new: true});
        } else{ // 스터디원인 경우
            await RegisterApplication.findOneAndUpdate({ userId: userId, study: study._id}, {
                $set : {
                    state: 3
                }
            }, {new: true});
        }

        return res
            .status(200)
            .json({msg : '열정 평가를 완료했습니다'});
    } catch (err) {
        logger.error("열정 평가 error : " + err)
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 과제 관리 - 해야할 과제 조회
// exports.manageAssignment = async function (req, res) {
//     const { userId } = req.params;
//     try {
//         var assignmentTodo = new Array();

//         // 등록지원서DB에서 userId에 해당하고 state=1인(수락된) 목록찾기
//         const acceptedStudyList = await RegisterApplication.find({ userId: userId, state: 1 })
//         if (acceptedStudyList.length == 0) { // 신청한 스터디가 없는 경우 과제도 없음
//             return res
//                 .status(200)
//               .json({ msg: '해야 할 과제가 없습니다' })
//         }

//         // 수락된 스터디 리스트에 과제가 있는지 확인하고 띄워주기
//         for (var i = 0; i < acceptedStudyList.length; i++) {
//             var study = await StudyList.findOne({ _id: acceptedStudyList[i].study }) // 스터디 찾아오기
//             // 해당 스터디에 생성된 과제가 있는지 확인 
//             var assignments = await Assignment.find({ study: study._id })

//             const result = {
//                 studyName: study.studyName,
//                 assignments: [assignments]
//             }
//             assignmentTodo[i] = result;
//             console.log(studyAndApplication[i]);
//         }
//         console.log(assignmentTodo);

//         return res
//             .status(200)
//             .json(assignmentTodo);

//     } catch (err) {
//         throw res
//             .status(500)
//             .json({ error: err })
//     }
// }