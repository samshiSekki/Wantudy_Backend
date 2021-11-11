const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');

const StudySchema = new Schema({
    userId: {
        type: Number,
        // required : true,
    },
    StudyId: {
        type: Number,
        default: 0,
    },
    studyName: { type: String, required: true },
    category: {
        type: [String],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0,
    },
    description: { type: String, required: true },
    onoff: {
        type: [String],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0,
    },
    studyTime: {
        type: [String],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0,
    },
    peopleNum: { type: Number, required: true },
    currentNum : {  type:Number, default: 0 },
    requiredInfo: {
        type: [String],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0,
    },
    deadline: {
        type: Date,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
    // start: {
    //     type: Date,
    //     required: true,
    // },
    period: {
        type: String,
        required: true,
    }, //기간
    level: {
        type: String,
        required: true
    } //난이도
    // report: {
    //     type: Number,
    //     default: 0
    // }
});

StudySchema.index({ studyName: 'text' });

StudySchema.plugin(autoIncrement.plugin, {
    model: 'Studylist',
    field: 'StudyId',
    startAt: 1, //시작
    increment: 1 // 증가
});

module.exports = mongoose.model('StudyList', StudySchema);
//StudyList라는 이름으로 StudySchema에 접근
