const mongoose = require('mongoose');
const { Schema } = mongoose;

// 등록 지원서 DB 
const registerApplicationSchema = new Schema({
    userId:{ // 누가 스터디 지원서 등록했는지
        type:Number,
    },
    application:{ // 등록한 지원서 전체
        type: Schema.Types.ObjectId,
        ref: 'Application',
    },
    study: { // 등록버튼 누른 스터디 정보 전체
        type: Schema.Types.ObjectId,
        ref: 'StudyList',
    },
    state:{ // 대기중:0 (default), 수락완료:1, 거절됨 :2 
        type:Number,
        default:0
    },
    registered:{
        type:Date,
        required:true
    }
});

module.exports = mongoose.model('RegisterApplication', registerApplicationSchema);