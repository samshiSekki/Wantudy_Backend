const mongoose = require('mongoose');
const { Schema } = mongoose;

const scheduleSchema = new Schema({
    userId: {
        type: Number
    },
    studyId: {
        type: Number,
        ref: "StudyList"
    },
    time:{
        type: [String],
        required: true
    }
})