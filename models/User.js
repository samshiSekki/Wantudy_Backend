const mongoose = require('mongoose');
const { Schema } = mongoose;
// userId - autoIncrement 
var autoIncrement = require('mongoose-auto-increment');

const userSchema = new Schema({
    userId:{
        type:Number,
        default:0
    },
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
    },
    state:{ // 대표지원서 있는지 여부
        type:Boolean,
        default:false 
    },
    temperature:{
        type:Number,
        default:36.5
    }
})

userSchema.plugin(autoIncrement.plugin, {
    model: 'User',
    field: 'userId',
    startAt: 1, //시작
    increment: 1 // 증가
});
module.exports = mongoose.model('User', userSchema);
