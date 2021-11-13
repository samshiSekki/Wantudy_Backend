const mongoose = require('mongoose');
const { Schema } = mongoose;
const autoIncrement = require('mongoose-auto-increment');

const commentSchema = new Schema({
    userId: {
        type: Number
    },
    recommentId: {
        type: Number,
        default: 0,
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

commentSchema.index({ content: 'text' });

commentSchema.plugin(autoIncrement.plugin, {
    model: 'recommentList',
    field: 'recommentId',
    startAt: 1,
    increment: 1
});


module.exports = mongoose.model('recommentList', commentSchema);