const Application = require("../models/Application");
const Assignment = require("../models/Assignment");
const LikeStudy = require("../models/LikeStudy");
const RegisterApplication = require("../models/RegisterApplication");
const StudyList = require('../models/StudyModel');
const User = require("../models/User");
const Schedule = require('../models/Schedule');
const RegisterAssignment = require("../models/RegisterAssignment");

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

        // objectId 받아서 studyList에서 다시 조회해오기
        for (var i = 0; i < applyStudyList.length; i++) {
            var study = await StudyList.findOne({ _id: applyStudyList[i].study }) // 어떤 스터디인지
            var state = applyStudyList[i].state; // 스터디 등록 상태 (대기, 수락, 거절)
            var application = await Application.findOne({ _id: applyStudyList[i].application }) // 해당스터디에 등록한 지원서

            const result = {
                studyId: study.StudyId,
                studyName: study.studyName,
                state,
                application
            }
            studyAndApplication[i] = result;
        }
        console.log(studyAndApplication);

        return res
            .status(200)
            .json(studyAndApplication);

    } catch (err) {
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
                    application: [null]
                }
            }
            else {
                var info = new Array()
                for (var j = 0; j < applicationObject.length; j++) {
                    var user = await User.findOne({ userId: applicationObject[j].userId }); // 열정온도 불러오기 위해서 유저부터 가져옴
                    var temperature = user.temperature; // 지원자의 열정온도
                    var application = await Application.findOne({_id: applicationObject[j].application}) // 지원서
                    var state = await applicationObject[j].state // 수락된 상태인지 아닌지 보여주기
                    if(!application){
                       continue;
                    }
                    var registered = await applicationObject[j].registered // 지원서 등록시기

                    info[j] = {
                        application,
                        temperature,
                        registered,
                        state
                    } 
                    
                }
                openedAndApplication[i] = {
                    study: openedStudyList[i], // 스터디 1개당 지원서 여러개 넣기 위해 이렇게 구조 짬
                    applications: info
                }
            }
        }

        return res
            .status(200)
            .json(openedAndApplication);

    } catch (err) {
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

// 개설한 스터디 상세보기 지원서 조회 - 스터디원 수락/거절 
exports.manageMember = async function (req, res) {
    const { userId, applicationId } = req.params;
    const { choice, studyId } = req.body;
    // applicationId를 받아서 applications에 있는 _id를 가져오고 그게 Register applicationId랑 같은지
    try {
        const study = await StudyList.findOne({ StudyId: studyId })
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
        const participated = await RegisterApplication.find({userId: userId, state:1},{_id:0, study:1}) 
        // 유저가 등록한 지원서 중 수락완료된 지원서 목록이 등록된 스터디 목록 (이게 없으면 지원도 안한거니까 참여하는 게 없음)
        var participatedStudyList = new Array()

        // 스터디원으로 참여하는 스터디 정보 가져오기 
        for(var i=0;i<participated.length;i++){
            participatedStudyList[i] = await StudyList.findOne({_id:participated[i].study})
        }
        console.log(participatedStudyList)

        // console.log(openedStudyList.length)
        // console.log(participatedStudyList.length)

        if(participatedStudyList.length==0 && openedStudyList.length==0){ // 스터디 신청x + 개설x 인 경우
            return res
                .status(200)
                .json({ msg: '참여하는 스터디가 없습니다' })
        }

        // 1. 개설한 스터디
        var openedStudy = new Array();
        for(var i=0;i<openedStudyList.length;i++){ // studylists 모델의 여러 개 가져온 것
            // 참여자 목록
            var members = new Array();
            const member = await RegisterApplication.find({study:openedStudyList[i]._id, state:1},{userId:1}) // 등록된 지원서 중 해당 스터디에 해당하며, 수락된 userId 목록찾기
           
            for(var j=0;j<member.length;j++){
                const user = await User.findOne({userId:member[j].userId}, {_id:0, userId:1, profileImage:1, nickname:1})
                members[j]=user
            }
            console.log(members);

            // 해야 할 과제 
            var assignment =await Assignment.find({studyId: openedStudyList[i].StudyId}); // 현 스터디에 부여된 과제 목록 (해야 할 과제)
            console.log(assignment);
            if(!assignment)
                assignment = '해야 할 과제가 없습니다'

            // 관리 할 과제            
            var manageAssignment = await RegisterAssignment.find({studyId: openedStudyList[i].StudyId}) // 등록된 과제 중에서 해당 스터디에 해당하는 것
            if(!manageAssignment)
                manageAssignment = '관리 할 과제가 없습니다'

            const study = {
                '스터디 정보' : openedStudyList[i],
                '참여자': members,
                '해야 할 과제': assignment,
                '관리 할 과제': manageAssignment
            }
            
            openedStudy[i]=study            
        }

        // 2. 참여하는 스터디  participatedStudyList
        var participatedStudy = new Array();
        for(var i=0;i<participatedStudyList.length;i++){ // 참여하는 스터디 목록 돌면서
            // 참여자 목록
            var members = new Array();
            const member = await RegisterApplication.find({study:participatedStudyList[i]._id, state:1},{userId:1}) // 등록된 지원서 중 해당 스터디에 해당하며, 수락된 userId 목록찾기
            console.log(member)
            for(var j=0;j<member.length;j++){
                const user = await User.findOne({userId:member[j].userId}, {_id:0, userId:1, profileImage:1, nickname:1})
                members[j]=user
            }

            // 해야 할 과제 
            var assignment =await Assignment.find({studyId: participatedStudyList[i].StudyId}); // 현 스터디에 부여된 과제 목록 (해야 할 과제)
            if(!assignment)
                assignment = '해야 할 과제가 없습니다'

            const study = {
                '스터디 정보' : participatedStudyList[i],
                '참여자': members,
                '해야 할 과제': assignment,
            } 
            participatedStudy[i]=study            
        }

        ongoingList={
            '스터디장 스터디' : openedStudy,
            '스터디원 스터디' : participatedStudy
        }

        return res
            .status(200)
            .json(ongoingList);

    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 과제 부여
// router.post('/:userId/ongoing-studylist/:studyId/giveAssignment', UserController.giveAssignment)
exports.giveAssignment = async function (req, res) {
    const { userId, studyId} = req.params;
    const { assignmentName, deadline } = req.body;
    // const { assignmentName, assignment } = req.body; // 테스트용
    const { assignment } = req.file; // 폼데이터나 폼태그를 통해 업로드한 이미지가 들어옴
    
    try{
        const todo = new Assignment({
            userId,
            studyId,
            assignmentName,
            assignment,
        })
        await todo.save();

        return res
            .status(200)
            .json(todo);

    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 과제 제출
// router.post('/:userId/ongoing-studylist/:studyId/submitAssignment', UserController.submitAssignment)

exports.submitAssignment = async function (req, res) {
    const { userId, studyId} = req.params;
    // const { assignmentName, deadline } = req.body;
    const { assignment, assignmentId } = req.body; // 테스트용
    // const { assignment } = req.file
    
    try{
        const submit = new RegisterAssignment({
            userId,
            studyId,
            assignmentId,
            assignment,
        })
        await submit.save();



        return res
            .status(200)
            .json(submit);
    } catch (err) {
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



//일정 조율 (참여 스터디 유저들 보여주기)
exports.schedule = async (req, res) => {
    const { userId, studyId } = req.params;

    try {
        // var ongoingUser = new Array();
        var UserTime = new Array();
        const study = await StudyList.findOne({ StudyId: studyId })
        const registeredStudyList = await RegisterApplication.find({ study: study._id, state: 1 })
        //해당 스터디에 지원한 지원서 중 수락된 지원서들

        for (var i = 0; i < registeredStudyList.length; i++) {
                // var users = await User.findOne ({userId : registeredStudyList[i].userId})
                // //해당 스터디에 수락된 유저들 불러오기 
                // ongoingUser[i] = users;
                var time = await Schedule.findOne({ userId: registeredStudyList[i].userId })
                UserTime[i] = time;
                //유저별 가능한 시간대 불러오기
        }
        // return res.status(200).json({
        //     status: 'succes',
        //     data: UserTime
        // })
        return res
            .status(200)
            .json(UserTime)
    } catch (err) {
        logger.error("일정 조율 get error : " + err)
        throw res
            .status(500)
            .json({ error: err })
    }
}

exports.scheduleSave = async (req, res) => {
    const { userId, studyId } = req.params;
    const { time } = req.body;

    const schedule = new Schedule({
        userId: userId,
        studyId: studyId,
        time: time
    })
    try {
        await schedule.save();
        return res
            .status(200)
            .json(schedule);
    } catch (err) {
        logger.error("일정 조율 post error : " + err)
        throw res.stats(500).json({ error: err })
    }
}

exports.scheduleCommon = async (req, res) => {
    const { userId, studyId } = req.params;

    try {
        var commonTime = new Array();
        var LastCommonTime = new Array();
        const schedule = await Schedule.find({ studyId: studyId })

        for (var i = 0; i < schedule.length; i++) {
            for (var j = 0; j < 7; j++) { //요일만큼 반복
                if (i == 0) { 
                    //첫번째 두번째 사람 공통시간대 뽑기
                    common = schedule[i].time[j].filter(x => schedule[i + 1].time[j].includes(x))
                    if (common.length > 1) { // 요일만 겹치는 경우 제외
                        commonTime.push(common) //commonTime에 공통 시간대 추가
                    }
                }
                //두번째 사람부터 다시 시작
                else if (0 < i < schedule.length - 1) {
                    if(commonTime[j]){
                        common = schedule[i].time[j].filter(x=>commonTime[j].includes(x))
                        if(common.length > 1 && common.length != commonTime[j].length){
                            //요일,시간이 모두 들어있고, 기존의 공통시간대와 겹치지 않는 공통시간대만 추가
                            commonTime.push(common)
                        }
                    }
                    else{
                        break
                    }
                }
                else {
                    break;
                }
            }
        }
        //각각 비교하여 계속 추가돼서 들어간 공통시간대(commonTime)과 
        //마지막 사람의 가능한 시간대를 요일 기준으로 비교하여 최종 공통시간대(LastCommonTime) 산출
        for(var k=0; k<commonTime.length; k++) {
            switch(commonTime[k][0]){
                case '월':
                    if(schedule[schedule.length-1].time[0].length > 1){
                        Mon = commonTime[k].filter(x => schedule[schedule.length-1].time[0].includes(x))
                        LastCommonTime.push(Mon)
                    }
                    break;
                case '화':
                    if(schedule[schedule.length-1].time[1].length > 1){
                        Tue = commonTime[k].filter(x => schedule[schedule.length-1].time[1].includes(x))
                        LastCommonTime.push(Tue)
                    }
                    break;
                case '수':
                    if(schedule[schedule.length-1].time[2].length > 1){
                        Wed = commonTime[k].filter(x => schedule[schedule.length-1].time[2].includes(x))
                        LastCommonTime.push(Wed)
                    }
                    break;
                case '목':
                    if(schedule[schedule.length-1].time[3].length > 1){
                        Thu = commonTime[k].filter(x => schedule[schedule.length-1].time[3].includes(x))
                        LastCommonTime.push(Thu)
                    }
                    break;
                case '금':
                    if(schedule[schedule.length-1].time[4].length > 1){
                        Fri = commonTime[k].filter(x => schedule[schedule.length-1].time[4].includes(x))
                        LastCommonTime.push(Fri)
                    }
                    break;
                case '토':
                    if(schedule[schedule.length-1].time[5].length > 1){
                        Sat = commonTime[k].filter(x => schedule[schedule.length-1].time[5].includes(x))
                        LastCommonTime.push(Sat)
                    }
                    break;
                case '일':
                    if(schedule[schedule.length-1].time[6].length > 1){
                        Sun = commonTime[k].filter(x => schedule[schedule.length-1].time[6].includes(x))
                        LastCommonTime.push(Sun)
                    }
                    break;
            }
        }
        const study = await StudyList.findOneAndUpdate({ StudyId: studyId },
            {
                $set:{
                    commonSchedule: LastCommonTime
                }
            }); // 스터디 찾아와서 디비에 공통시간대 추가해줌
        return res
            .status(200)
            .json(study.commonSchedule)
    } catch (err) {
        logger.error("공통 시간대 error : " + err)
        return res
            .status(500)
            .json({ error: err })
    }
}