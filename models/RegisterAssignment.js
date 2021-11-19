const mongoose = require('mongoose');
const { Schema } = mongoose;

// 제출한 과제 DB
const registerAssignmentSchema = new Schema({
    userId:{ // 어떤 유저가 과제를 제출했는지
        type:Number
    },
    studyId: {
        type:Number
    },
    assignmentId:{ // 어떤 과제에 등록한 건지
        type:Number
    }
});

/*
    3번 유저가 1번 스터디에 2번 과제 등록
    3번 유저가 1번 스터디에 3번 과제 등록

 */
module.exports = mongoose.model('RegisterAssignment', registerAssignmentSchema);