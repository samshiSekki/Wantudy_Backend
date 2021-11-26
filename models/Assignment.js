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
    studyId: {
        type:Number
    },
    studyName:{
        type:String
    },
    assignmentName:{
        type:String,
        required:true
    },
    assignment:{ // 과제 설명 
        type:String
    },
    deadline:{
        type:Date,
        default:Date.now() // 테스트용
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