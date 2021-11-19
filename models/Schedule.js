const mongoose = require('mongoose');
const { Schema } = mongoose;

const scheduleSchema = new Schema({
    userId: {
        type: Number,
        ref: "User"
    },
    studyId: {
        type: Number,
        ref: "StudyList"
    },
    time:{
        type: [[String]],
        required: true
    }
})

module.exports = mongoose.model('Schedule', scheduleSchema);