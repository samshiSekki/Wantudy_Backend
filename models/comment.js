const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');

const commentSchema = new Schema({
    userId: {
        type: Number
    },
    studyId: {
        type: Number,
        ref: "StudyList"
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

commentSchema.index({ content: 'text' });

commentSchema.plugin(autoIncrement.plugin, {
    model: 'commentList',
    field: 'commentId',
    startAt: 1,
    increment: 1
});

module.exports = mongoose.model('commentList', commentSchema);