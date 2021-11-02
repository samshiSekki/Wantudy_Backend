const Application = require("../models/Application");
// const path=require('path');


/* 
    1) 상단바에서 지원서 등록하기 - 조회, 작성, (수정, 삭제)
    2) 스터디 신청버튼 눌렀을 때 지원서 등록하기 - 수정, 조회, 작성, 신청(등록), 삭제 
*/

/* 
    1,2 - 지원서 목록 조회
    https://url:8080/posts?pages=1&limit=5
*/
exports.showApplication = async function (req, res) {
    const { userId } = req.body;
    const { page } = req.query;

    if (page < 1) {
        return res
            .status(400)
            .json({ error: err })
    }

    try {
        const Applications = await Application.find(userId) 
            .sort({ applicationId : -1}) // 내림차순 정렬
            .limit(5)
            .skip((page - 1) * 3)
            .exec();

        const count = await Applications.countDocuments().exec();
        res.set('Last-Page', Math.ceil(count / 3)); // 응답헤더를 설정 res.set(name, value)
        return res
            .status(200)
            .json(Applications);

    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

// 1,2 - 새로운 지원서 작성
exports.saveApplication = async function (req, res){
    const { userId, name, gender, age, school, 
        major, attending, semester, address, interests, keyword, message } = req.body;

    const application = new Application({
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
        message,
        created:Date.now(), // db들어갈 때 넣어주는 값
    });

    try {
        await application.save();
        return res
            .status(200)
            .json(user) // 지원서 등록
    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }    
}

// 1,2 - 지원서 상세보기 /study/application/1
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

// 1 - 스터디 신청 시에 지원서 등록하기 /study/{studyId}/application

// 2 - 지원서 수정 (저장 / 다른 이름으로 저장)
exports.updateApplication = async function (req, res){
    const { userId, applicationName, name, gender, age, school, 
        major, attending, semester, address, interests, keyword, message } = req.body;
    const { applicationId } = req.params;

    try {
        if(applicationName===''){ // 저장인 경우
            const application = await Application.findOneAndUpdate(applicationId,{
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
                    message: message,
                    updated: Date.now() // 수정된 시각
                }
            },{new: true}).exec();
            if (!application) {
                return res
                    .status(404)
                    .json({ error: err});
            }
        } 
        else { // 다른 이름으로 저장인 경우
            const application = await Application.findOneAndUpdate(applicationId,{
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
                    message: message,
                    updated: Date.now() // 수정된 시각
                }
            },{new: true}).exec(); // 콜백 함수 없이 바로 쿼리를 실행시키려면, update() 호출 후 exec()를 호출
            if (!application) {
                return res
                    .status(404)
                    .json({ error: err});
            }
        }
        return res
            .status(200)
            .json(application);

    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }    

}

// 2 - 지원서 삭제하기
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