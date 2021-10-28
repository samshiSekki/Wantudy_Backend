const mongoose = require('mongoose');
const { Schema } = mongoose;

const StduySchema = new Schema({
    // userId : {type: Schema.ObjectId, ref:"User", required: true},
    studyName: { type: String, required: true },
    category: { type: [String], required: true },
    description: { type: String, required: true },
    onoff: { type: String, required: true },
    studyTime: { type: [String], required: true },
    peopleNum: { type : Number, required: true },
    requiredInfo: { type: [String], required: true },
    deadline: { type: Date, required: true },
});

module.exports = mongoose.model('StudyList', StduySchema);
//StudyList라는 이름으로 StudySchema에 접근
