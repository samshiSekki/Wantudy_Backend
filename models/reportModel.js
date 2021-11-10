const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema({
    studyId: {
        type: Number,
    },
    reason: {
        type: [String],
        required: true
    }
})

module.exports = mongoose.model('reportList', reportSchema);