const mongoose = require('mongoose');
const { Schema } = mongoose;

// 제출한 과제 DB
const registerApplicationSchema = new Schema({
    // study: { // 어떤 스터디에 제출한 과제인지
    //     type: Schema.Types.ObjectId,
    //     ref: 'StudyList',
    // },
    studyId: {
        type:Number
    },
    assignment:{
        type:Buffer,
        required:true
    }
});

module.exports = mongoose.model('RegisterApplication', registerApplicationSchema);