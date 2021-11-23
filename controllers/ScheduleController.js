const RegisterApplication = require("../models/RegisterApplication");
const StudyList = require('../models/StudyModel');
const User = require("../models/User");
const Schedule = require('../models/Schedule');
const logger = require('../.config/winston');


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

//스터디 일정 수정
exports.scheduleUpdate = async (req, res) => {
    const { userId, studyId } = req.params;
    const { time } = req.body;

    try {
        const schedule = await Schedule.findOneAndUpdate({ userId: userId, studyId: studyId }, 
        {
            $set: {
                time: time
            },
        },
            { new: true })
            .exec();
        return res
            .status(200)
            .json(schedule)
    } catch (err) {
        logger.error("일정 조율 수정 error : " + err)
        throw res
            .status(500)
            .json(({ error: err }))
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
                    logger.info(schedule[i].time[j])
                    common = schedule[i].time[j].filter(x => schedule[i + 1].time[j].includes(x))
                    if (common.length > 1) { // 요일만 겹치는 경우 제외
                        commonTime.push(common) //commonTime에 공통 시간대 추가
                    }
                }
                //두번째 사람부터 다시 시작
                else if (0 < i < schedule.length - 1) {
                    if (commonTime[j]) {
                        common = schedule[i].time[j].filter(x => commonTime[j].includes(x))
                        if (common.length > 1 && common.length != commonTime[j].length) {
                            //요일,시간이 모두 들어있고, 기존의 공통시간대와 겹치지 않는 공통시간대만 추가
                            commonTime.push(common)
                        }
                    }
                    else {
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
        for (var k = 0; k < commonTime.length; k++) {
            switch (commonTime[k][0]) {
                case '월':
                    if (schedule[schedule.length - 1].time[0].length > 1) {
                        Mon = commonTime[k].filter(x => schedule[schedule.length - 1].time[0].includes(x))
                        LastCommonTime.push(Mon)
                    }
                    break;
                case '화':
                    if (schedule[schedule.length - 1].time[1].length > 1) {
                        Tue = commonTime[k].filter(x => schedule[schedule.length - 1].time[1].includes(x))
                        LastCommonTime.push(Tue)
                    }
                    break;
                case '수':
                    if (schedule[schedule.length - 1].time[2].length > 1) {
                        Wed = commonTime[k].filter(x => schedule[schedule.length - 1].time[2].includes(x))
                        LastCommonTime.push(Wed)
                    }
                    break;
                case '목':
                    if (schedule[schedule.length - 1].time[3].length > 1) {
                        Thu = commonTime[k].filter(x => schedule[schedule.length - 1].time[3].includes(x))
                        LastCommonTime.push(Thu)
                    }
                    break;
                case '금':
                    if (schedule[schedule.length - 1].time[4].length > 1) {
                        Fri = commonTime[k].filter(x => schedule[schedule.length - 1].time[4].includes(x))
                        LastCommonTime.push(Fri)
                    }
                    break;
                case '토':
                    if (schedule[schedule.length - 1].time[5].length > 1) {
                        Sat = commonTime[k].filter(x => schedule[schedule.length - 1].time[5].includes(x))
                        LastCommonTime.push(Sat)
                    }
                    break;
                case '일':
                    if (schedule[schedule.length - 1].time[6].length > 1) {
                        Sun = commonTime[k].filter(x => schedule[schedule.length - 1].time[6].includes(x))
                        LastCommonTime.push(Sun)
                    }
                    break;
            }
        }
        const study = await StudyList.findOneAndUpdate({ StudyId: studyId },
            {
                $set: {
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

// 일정 조율 최종 선택
exports.scheduleCommonLast = async (req, res) => {
    const { userId, studyId } = req.params;
    const { time } = req.body;
    console.log(time);
    try {
        const study = await StudyList.findOneAndUpdate({ StudyId: studyId },
        {
            $set: {
                commonSchedule: time
            },
        },
        {new : true })
        .exec();
        return res
            .status(200)
            .json(study.commonSchedule)
    }catch(err){
        looger.error("일정 조율 최종 선택 error: "  + err)
        throw res
            .status(500)
            .json({error: err})
    }
}