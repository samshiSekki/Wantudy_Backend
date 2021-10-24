const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    // 세션값 받아와야하나?
    nickname:{
        type:String,
        minlength:8,
        require:true
    }
})

const User = mongoose.model('User', userSchema) 
module.exports = { User } 