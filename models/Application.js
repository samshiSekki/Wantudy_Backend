const mongoose = require('mongoose');
const { Schema } = mongoose;

const applicationSchema = new Schema({
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
    }

})

module.exports = mongoose.model('Application', applicationSchema);

