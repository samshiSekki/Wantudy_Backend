const mongoose = require('mongoose');
const { Schema } = mongoose;

const LikeSchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    Study: {
        type: mongoose.Types.ObjectId,
        ref: 'StudyList',
    },
});

module.exports = mongoose.model('LikeStudy', LikeSchema);