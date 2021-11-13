const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    userId: {
        type: Number
    },
    studyId: {
        type: Number,
        ref: "StudyList"
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref:"commentList"
    },
    content: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model('recommentList', commentSchema);