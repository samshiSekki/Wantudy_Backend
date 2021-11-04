const Application = require("../models/Application");
const StudyList = require('../models/StudyModel');
const RegisterApplication = require('../models/RegisterApplication');
const logger=require('../.config/winston');

// 스터디 지원서 조회
exports.showApplication = async function (req, res) {
    const { userId } = req.body;
    const { page } = req.query;

    if (page < 1) 
        return res
            .status(400)
            .json({ error: err })
    
    try {
        const applications = await Application.find({userId:userId}) 
            .sort({ applicationId : -1}) // 내림차순 정렬
            .limit(5)
            .skip((page - 1) * 5)
            .exec();

        const count = await Application.countDocuments().exec();
        res.set('Last-Page', Math.ceil(count / 5 )); // 응답헤더를 설정 res.set(name, value)
        return res
            .status(200)
            .json(applications);
    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 새로운 지원서 작성
exports.saveApplication = async function (req, res){
    const { userId, name, gender, age, school, 
        major, attending, semester, address, interests, keyword, applyMotive, message } = req.body;

    const application = new Application({ // 뭐가들어올지 모르니까 프론트에서 다 보내주세요
        userId,
        name,
        gender,
        age,
        school,
        major,
        attending,
        semester,
        address,
        interests,
        keyword,
        applyMotive,
        message,
    });

    try {
        await application.save();
        return res
            .status(200)
            .json(application) // 지원서 등록
    } catch (err) {
        logger.error(err)
        throw res
            .status(500)
            .json({ error: err })
    }    
}

// 지원서 상세보기 /study/application/1
exports.detailApplication = async function (req, res) {
    const { applicationId } = req.params;
    try {
        const application = await Application.findOne({applicationId : applicationId});

        if(!application)
            return res
                .status(404)
                .end();
        else 
            return res
                .status(200)
                .json(application)    
    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 스터디 신청 시에 지원서 등록하기 /study/{studyId}/application
exports.registerApplication = async function (req, res) {
    const { studyId } = req.params;
    const { userId, applicationId } = req.body;

    try{
        const study = await StudyList.findOne({StudyId: studyId});
        const application = await Application.findOne({applicationId: applicationId});

        if(!study)
            return res
                .status(404)
                .end();

        if(study.userId == userId)
            return res
                .status(400)
                .json({
                    msg:'자신이 개설한 스터디에는 등록할 수 없습니다'
                });
        
        const registerApplication = new RegisterApplication({
            userId,
            study,
            application,
            registered:Date.now()        
        })

        await registerApplication.save();
        return res
            .status(200)
            .json({
                msg:'스터디 지원서가 등록되었습니다.'
            })

    } catch (err) {
        logger.error("스터디 신청 시 지원서 등록 오류:" +err);
        throw res
            .status(500)
            .json({ error: err })
    }   
}

// 지원서 수정 (저장 / 다른 이름으로 저장)
exports.updateApplication = async function (req, res){
    const { userId, applicationName, name, gender, age, school, 
        major, attending, semester, address, interests, keyword, applyMotive, message } = req.body;
    const { applicationId } = req.params;

    if(applicationName===''){ // 저장인 경우
        try{
            const application = await Application.findOneAndUpdate({applicationId:applicationId},{
                $set: {
                    name: name,
                    gender: gender,
                    age: age,
                    school: school,
                    major: major, 
                    attending: attending,
                    semester: semester,
                    address: address,
                    interests: interests,
                    keyword: keyword,
                    applyMotive: applyMotive,
                    message: message,
                }
            },{new: true});
    
            if (!application) 
                return res
                    .status(404)
                    .end();

            return res
                .status(200)
                .json(application);
        }catch (err) {
            throw res
                .status(500)
                .json({ error: err })
        }    
    }
    else { // 다른 이름으로 저장인 경우
        try{
            const application = await Application.findOneAndUpdate({applicationId:applicationId},{
                $set: {
                    applicationName: applicationName,
                    name: name,
                    gender: gender,
                    age: age,
                    school: school,
                    major: major,
                    attending: attending,
                    semester: semester,
                    address: address,
                    interests: interests,
                    keyword: keyword,
                    applyMotive: applyMotive,
                    message: message,
                }
            },{new: true});
           
            if (!application) 
                return res
                    .status(404)
                    .end();
        
            return res
                .status(200)
                .json(application);
        } catch (err) {
            throw res
                .status(500)
                .json({ error: err })
        }
    }
}

// 지원서 삭제하기
exports.deleteApplication = async function (req, res) {
    const { applicationId } = req.params;
    try {
        await Application.findOneAndDelete({applicationId : applicationId});
        return res
            .status(200)
            .json({ msg : '신청서가 삭제되었습니다'});
    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}