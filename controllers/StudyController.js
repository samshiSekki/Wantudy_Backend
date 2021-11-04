const mongoose = require("mongoose");
const StudyList = require('../models/StudyModel');
const LikeStudy = require('../models/LikeStudy');
const path = require('path');
const logger = require('../.config/winston');

//스터디 개설 페이지 보여주기
exports.createStudy = function (req, res) {
    res.sendFile(path.join(__dirname, '../../build/index.html'))
}

//StudyList에 document 저장
exports.saveStudy = async function (req, res) {
    const { userId, studyName, category, description, onoff,
        studyTime, peopleNum, requiredInfo, deadline, start, end } = req.body;
    logger.info("userId : "+req.body.userId)
    // console.log(req.body)
>>>>>>> 7df0d85ecc1a9c1939ca3c0eaa367de84f28623d
    const study = new StudyList({
        userId,
        studyName,
        category,
        description,
        onoff,
        studyTime,
        peopleNum,
        requiredInfo,
        deadline,
        start,
        end,
    })
    if (req.body.deadline !== null) {
        study.deadline = new Date(req.body.deadline);
    }
    try {
        await study.save();
        return res
            .status(200)
            .json(study);
    } catch (err) {
        logger.error("스터디저장 error : "+err)
        throw res.status(500).json({ error: err })
    }
};

//스터디 리스트 페이지 조회 ( 한 페이지 당 5개씩 )
//마감기한 임박순 디폴트
exports.showStudy = async function (req, res) {

    const { page } = req.query;
    console.log(page);

    if (page < 1) {
        return res.status(400).json({ error: err })
    }

    try {
        const studypost = await StudyList.find()
            .sort({ deadline: 1 })
            .limit(5)
            .skip((page - 1) * 5)
            .exec();
        const postCount = await StudyList.countDocuments().exec();
        res.set('Last-Page', Math.ceil(postCount / 5));
        return res
            .status(200)
            .json(studypost);
    } catch (err) {
        throw res
            .status(500)
            .json({ error: err })
    }
}

//스터디 상세 페이지 조회
exports.detailStudy = async function (req, res) {

    const { studyId } = req.params;
    console.log(req.params);

    try {
        const study = await StudyList.findOne({ StudyId: studyId })
        if (!study) {
            return res.status(404).end();
        } else {
            return res
                .status(200)
                .json(study)
        }
    } catch (err) {
        throw res
            .status(500)
            .json({ error: err });
    }
}


//스터디 검색하기
exports.searchStudy = async function (req, res) {

    const { page } = req.query
    console.log(page);
    let options = [];

    if (page < 1) {
        return res.status(400)
    }

    try {
        if (req.query.option == 'studyName') {
            options = [{ studyName: new RegExp(req.query.content) }];
        }
        else {
            const err = new Error('검색 옵션이 없습니다.');
            err.status = 400;
            throw err;
        }
        const studypost = await StudyList.find({ $or: options })
            .sort({ deadline: 1 })
            .limit(5)
            .skip((page - 1) * 5)
            .exec();
        const postCount = await StudyList.countDocuments().exec();
        res.set('Last-Page', Math.ceil(postCount / 5)); //헤더에 라스트 페이지 표시
        return res
            .status(200)
            .json(studypost);
    } catch (err) {
        logger.error("스터디 검색 err : " + err )
        throw res.status(500).json({ error: err })
    }
}

//게시글 삭제
exports.deleteStudy = async function (req, res) {
    const { studyId } = req.params;
    console.log(req.params);
    try {
        await StudyList.findOneAndDelete({ StudyId: studyId })
        return res.status(204).json();
    } catch (err) {
        throw res.status(500).json({ error: err })
    }
}

//게시글 수정
exports.updateStudy = async function (req, res) {
    const { studyId } = req.params;

    try {
        const study = await StudyList.findOneAndUpdate({ StudyId: studyId },
            {
                $set: {
                    studyName: req.body.studyName,
                    category: req.body.category,
                    description: req.body.description,
                    onoff: req.body.onoff,
                    studyTime: req.body.studyTime,
                    peopleNum: req.body.peopleNum,
                    requiredInfo: req.body.requiredInfo,
                    deadline: req.body.deadline,
                    satrt: req.body.start,
                    end: req.body.end
                },
                updated: Date.now()
            },
            { new: true })
            .exec();
        if (!study) {
            return res.status(404)
        }
        return res
            .status(200)
            .json(study);
    } catch (err) {
        logger.error("스터디 수정 err: " + err)
        throw res.status(500).json({ error: err })
    }
};

//스크랩 
exports.likeStudy = async function (req, res) {
    const { studyId } = req.params;
    console.log(req.params);

    try {
        const study = await StudyList.findOne({ StudyId: studyId }).exec();
        // console.log(study._id)
        const check = await LikeStudy.findOne({ study: study._id }).exec();
        // console.log(check)
        if (!study) {
            return res.status(404).end();
        }
        else if (check) {
            return res.send('이미 찜한 스터디입니다.').end();
        }
        else {
            const like = new LikeStudy({ study: study });
            await like.save();
            // console.log(like.study._id)
            return res
                .status(200)
                .json(like)
        }
    } catch (err) {
        logger.error("스터디 스크랩 err: " + err)
        throw res
            .status(500)
            .json({ error: err });
    }
}
