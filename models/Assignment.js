const mongoose = require('mongoose');
const { Schema } = mongoose;
var autoIncrement = require('mongoose-auto-increment');

const assignmentSchema = new Schema({
    assignmentId: {
        type: Number,
        default:0
    },
    userId: { // 과제 부여한 사람
        type: Number
    },
    study: { // 어떤 스터디에 과제부여했는지
        type: Schema.Types.ObjectId,
        ref: 'StudyList',
    },
    assignmentName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    deadline:{
        type:Date,
        required:true
    }
});

assignmentSchema.plugin(autoIncrement.plugin, {
    model: 'Assignment',
    field: 'assignmentId',
    startAt: 1, //시작
    increment: 1 // 증가
});
module.exports = mongoose.model('Assignment', assignmentSchema);