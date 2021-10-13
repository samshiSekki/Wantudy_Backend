//var mongoose = require("mongoose");
const StudyList = require('../models/StudyModel');

//Study Schema
// function StudyData(data){
//     this.id = data._id;
//     this.studyName = data.studyName;
//     this.category= data.category;
//     this.description=data.description;
//     this.onoff=data.onoff;
//     this.studyTime=data.studyTime;
//     this.peopleNum=data.peopleNum;
//     this.requiredInfo=data.requiredInfo;
// }

exports.createStudy=function(req,res){
    res.send('스터디 추가 페이지')
}

exports.saveStudy=async function(req,res){
    const{studyName, category, description, onoff, studyTime, peopleNum, requiredInfo} = req.body;
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
    try{
        await study.save();
        return res
            .status(200)
            .json(study);
    }catch(err){
        return res.status(500).json({error:err})
    }
};