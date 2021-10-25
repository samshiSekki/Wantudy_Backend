const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    email:{
        type:String,
        require:true
    },
    profileImage:{
        type:String,
        require:true
    },
    accessToken:{
        type:String,
        require:true
    }
})

module.exports = mongoose.model('User', userSchema);


