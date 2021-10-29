const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email:{
        type:String,
        required:true
    },
    profileImage:{
        type:String,
        required:true
    },
    accessToken:{
        type:String,
        required:true
    },
    nickname:{
        type:String,
        maxlength:8
    }
})

module.exports = mongoose.model('User', userSchema);
