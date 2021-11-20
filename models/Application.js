const mongoose = require('mongoose');
const { Schema } = mongoose;
var autoIncrement = require('mongoose-auto-increment');

const applicationSchema = new Schema({
    userId:{ // 누가 신청서를 작성했는지
        type:Number,
    },
    applicationId:{ // 신청서 번호 auto increment
        type:Number,
        default:0
    },
    // studyId:{ // 스터디에 등록하는 경우 이 값이 바뀜. 아니면 default=0 값 유지
    //     type:Number,
    //     default:0
    // },
    applicationName:{ // 값이 없으면 띄워줄 때 신청서1,2..이런식으로 가게
        type:String,
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
        type:[Number],
        validate: v => Array.isArray(v) && v.length > 0,
    },
    specification:{
        type:String,
    },
    address:{
        type:String,
    },
    interests:{        
        type:[String],
        validate: v => Array.isArray(v) && v.length > 0,
    },
    keyword:{
        type:[String],
        validate: v => Array.isArray(v) && v.length > 0, 
    },
    message:{
        type:String,
        default:""
    }
})

applicationSchema.plugin(autoIncrement.plugin, {
    model: 'Application',
    field: 'applicationId',
    startAt: 1, //시작
    increment: 1 // 증가
});

module.exports = mongoose.model('Application', applicationSchema);


