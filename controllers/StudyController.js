//const mongoose = require("mongoose");
const StudyList = require('../models/StudyModel');
const path=require('path');

//스터디 개설 페이지 보여주기
exports.createStudy=function(req,res){
    res.sendFile(path.join(__dirname,'../../build/index.html'))
}

//StudyList에 document 저장
exports.saveStudy = async function (req, res) {
    const { studyName, category, description, onoff, studyTime, peopleNum, requiredInfo } = req.body;
    console.log(req.body)
    var study = new StudyList({
        studyName,
        category,
        description,
        onoff,
        studyTime,
        peopleNum,
        requiredInfo
    })
    try {
        await study.save();
        return res
            .status(200)
            .json(study);
    } catch (err) {
        return res.status(500).json({ error: err })
    }
};