const mongoose = require('mongoose');
const { Schema } = mongoose;

const StduySchema = new Schema({
    //userId : {type: Schema.ObjectId, ref:"User", required: true},
    studyName: { type: String, require: true },
    category: { type: [String], require: true },
    description: { type: String, require: true },
    onoff: { type: String, require: true },
    studyTime: { type: [String], require: true },
    peopleNum: Number,
    requiredInfo: { type: [String], require: true },
    deadline: { type: Date, require: true },
});

module.exports = mongoose.model('StudyList', StduySchema);
//StudyList라는 이름으로 StudySchema에 접근
