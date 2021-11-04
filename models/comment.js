const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    commenter : {
        type:Number
    },
    studyId : {
        type:Number,
        ref:"StudyList"
    },
    content:{
        type: [String],
        required: true,
        validate: v => Array.isArray(v) && v.length > 0,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated:{
        type: Date,
        default: Date.now,
    },
})



module.exports = mongoose.model('commentList', commentSchema);