const mongoose = require('mongoose');
const { Schema } = mongoose;

const LikeSchema = new Schema({
    userId:{ // 누가 스터디 찜했는지
        type:Number
    },
    study: { // 스터디 정보 객체 
        type: Schema.Types.ObjectId,
        ref: 'StudyList',
    }
});

module.exports = mongoose.model('LikeStudy', LikeSchema);