const mongoose = require('mongoose');
const { Schema } = mongoose;

// 제출한 과제 DB
const registerAssignmentSchema = new Schema({
    // study: { // 어떤 스터디에 제출한 과제인지
    //     type: Schema.Types.ObjectId,
    //     ref: 'StudyList',
    // },
    userId:{ // 어떤 유저가 과제를 제출했는지
        type:Number
    },
    studyId: {
        type:Number
    },
    assignmentId:{ // 어떤 과제에 등록한 건지
        type:Number
    }, 
    // assignment:{ // 등록한 과제파일 
    //     type:Buffer,
    //     required:true
    // }
    assignment:{ // 테스트용 
        type:String
    }
});

module.exports = mongoose.model('RegisterAssignment', registerAssignmentSchema);