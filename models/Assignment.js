const mongoose = require('mongoose');
const { Schema } = mongoose;
var autoIncrement = require('mongoose-auto-increment');

/* 과제 부여하는 경우 단순 과제 저장 */

const assignmentSchema = new Schema({
    assignmentId: {
        type: Number,
        default:0
    },
    userId: { // 과제 부여한  사람
        type: Number
    },
    // study: { // 어떤 스터디에 과제부여했는지
    //     type: Schema.Types.ObjectId,
    //     ref: 'StudyList',
    // },
    studyId: {
        type:Number
    },
    assignmentName:{
        type:String,
        required:true
    },
    assignment:{
        type:Buffer,
    },
    deadline:{
        type:Date,
        required:true
    },
    currentNum : { // 현재 제출한 인원
        type:Number,
        default:0
    }
});

assignmentSchema.plugin(autoIncrement.plugin, {
    model: 'Assignment',
    field: 'assignmentId',
    startAt: 1, //시작
    increment: 1 // 증가
});
module.exports = mongoose.model('Assignment', assignmentSchema);