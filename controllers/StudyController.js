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
        return res.status(500).json({ error: err })
    }
};


//스터디 리스트 페이지 조회 ( 한 페이지 당 3개씩 )
exports.showStudy = async function (req, res) {

    const { page } = req.query
    console.log(page);

    if (page < 1) {
        return res.status(400).json({ error: err })
    }

    try {
        const studypost = await StudyList.find()
            .sort({ _id: -1 })
            .limit(3)
            .skip((page - 1) * 3)
            .exec();
        const postCount = await StudyList.countDocuments().exec();
        res.set('Last-Page', Math.ceil(postCount / 3));
        return res
            .status(200)
            .json(studypost);
    } catch (err) {
        return res.status(500).json({ error: err })
    }
}


//스터디 상세 페이지 조회
exports.detailStudy = async function (req, res) {

    const { studyId } = req.params;
    console.log(req.params);

    try {
        const study = await StudyList.findById(studyId).exec();
        if (!study) {
            return res.status(404).end()
        } else {
            return res
                .status(200)
                .json(study)
        }
    } catch (err) {
        return res.status(500).json({ error: err });
    }
}