const mongoose = require('mongoose');
const { Schema } = mongoose;
// applicationId - autoIncrement 
var autoIncrement = require('mongoose-auto-increment');

const applicationSchema = new Schema({
    userId:{ // 누가 신청서를 작성했는지
        type:Number,
    },
    applicationId:{ // 신청서 수정할 때 
        type:Number,
        default:0
    },
    applicationName:{ // 값이 없으면 띄워줄 때 신청서1,2..이런식으로 가게
        type:String,
    },
    created: { 
        type: Date, 
    },
    updated:{
        type: Date, 
    },
    name:{
        type:String,
    },
    gender:{
        type:String,
    },
    age:{
        type:Number,
    },
    school:{
        type:String,
    },
    major:{
        type:String,
    },
    attending:{
        type:String,
    },
    semester:{
        type:[Number]
    },
    address:{
        type:String,
    },
    interests:{        
        type:[String],
    },
    keyword:{
        type:[String],
    },
    applyMotive:{
        type:String,
    },
    message:{
        type:String
    }
})

applicationSchema.plugin(autoIncrement.plugin, {
    model: 'Application',
    field: 'applicationId',
    startAt: 1, //시작
    increment: 1 // 증가
});

module.exports = mongoose.model('Application', applicationSchema);

