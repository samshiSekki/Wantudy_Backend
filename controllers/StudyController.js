const mongoose = require("mongoose");
const StudyList = require('../models/StudyModel');
const path = require('path');

//스터디 개설 페이지 보여주기
exports.createStudy = function (req, res) {
    res.sendFile(path.join(__dirname, '../../build/index.html'))
}

//StudyList에 document 저장
exports.saveStudy = async function (req, res) {
    const { studyName, category, description, onoff, studyTime, peopleNum, requiredInfo, deadline } = req.body;
    console.log(req.body)
    const study = new StudyList({
        studyName,
        category,
        description,
        onoff,
        studyTime,
        peopleNum,
        requiredInfo,
        deadline,
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
        throw res.status(500).json({ error: err })
    }
};

//스터디 리스트 페이지 조회 ( 한 페이지 당 3개씩 )
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
            .limit(3)
            .skip((page - 1) * 3)
            .exec();
        const postCount = await StudyList.countDocuments().exec();
        res.set('Last-Page', Math.ceil(postCount / 3));
        return res
            .status(200)
            .json(studypost);
    } catch (err) {
        throw res.status(500).json({ error: err })
    }
}

//스터디 상세 페이지 조회
exports.detailStudy = async function (req, res) {

    const { studyId } = req.params;
    console.log(req.params);

    try {
        const study = await StudyList.findById(studyId).exec();
        if (!study) {
            return res.status(404).end();
        } else {
            return res
                .status(200)
                .json(study)
        }
    } catch (err) {
        throw res.status(500).json({ error: err });
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
            .limit(3)
            .skip((page - 1) * 10)
            .exec();
        const postCount = await StudyList.countDocuments().exec();
        res.set('Last-Page', Math.ceil(postCount / 3));
        return res
            .status(200)
            .json(studypost);
    } catch (err) {
        throw res.status(500).json({ error: err })
    }
}

//게시글 삭제
exports.deleteStudy = async function (req, res) {
    const { studyId } = req.params;
    console.log(req.params);
    try {
        await StudyList.findByIdAndDelete(studyId).exec();
        return res.status(204).json();
    } catch (err) {
        throw res.status(500).json({ error: err })
    }
}

//게시글 수정
exports.updateStudy = async function (req, res) {
    const { studyId } = req.params;

    try {
        const study = await StudyList.findByIdAndUpdate(studyId,
            {
                $set: {
                    studyName: req.body.studyName,
                    category: req.body.category,
                    description: req.body.description,
                    onoff: req.body.onoff,
                    studyTime: req.body.studyTime,
                    peopleNum: req.body.peopleNum,
                    requiredInfo: req.body.requiredInfo,
                    deadline: req.body.deadline
                }
            },{new: true}).exec();
        if (!study) {
            return res.status(404)
        }
        req.body=study;
        return res
            .status(200)
            .json(study);
    } catch (err) {
        throw res.status(500).json({ error: err })
    }
};