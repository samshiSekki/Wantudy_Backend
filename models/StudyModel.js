const mongoose = require('mongoose');
const { Schema } = mongoose;

const StduySchema = new Schema({
    // user:{
    //     _id : mongoose.Types.ObjectId,
    //     nickname: String,
    // },
    studyName: { type: String, required: true },
    category: {
        type: [String],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0,
    },
    description: { type: String, required: true },
    onoff: { type: String, required: true },
    studyTime: {
        type: [String],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0,
    },
    peopleNum: { type: Number, required: true },
    requiredInfo: {
        type: [String],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0,
    },
    deadline: { type: Date, required: true },
});

StduySchema.index({ studyName: 'text' });

module.exports = mongoose.model('StudyList', StduySchema);
//StudyList라는 이름으로 StudySchema에 접근
