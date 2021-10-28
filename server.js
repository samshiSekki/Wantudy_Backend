// const express = require('express');
// const app = express();
// //post 받아오기 위해 body-parser 사용
// app.use(express.urlencoded({ extended: false }))

// //react ajax 통신
// app.use(express.json());
// const cors = require('cors');
// app.use(cors());

// const path = require('path');
// require('dotenv').config();

// //swagger
// const swaggerUi = require("swagger-ui-express");
// const swaggerFile = require("./swagger-output");
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// // DB connection
// const id = process.env.DBid
// const pwd = process.env.DBpwd

// const mongoose = require("mongoose");
const express= require('express');
const app = express();
const port = 8080;
const cors = require('cors');
require('dotenv').config(); // 환경설정 파일

app.use(cors());
app.use(express.json());

var id = 'sam'

var pwd = 'sam1234'

var mongoose = require("mongoose");
mongoose.connect(`mongodb://${id}:${pwd}@13.209.66.117:27017/admin`, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.error("mongoDB Connection Error!", err);
    }
    console.log("mongoDB Connected!");

//     // Server Open
//     app.listen(8080, function () {
//         console.log("Server listening on port 8080!");
//     });
// });

// //router 사용
// const studyRouter = require("./routes/study");
// app.use('/study', studyRouter);

// //react bulid
// app.use(express.static(path.join(__dirname,'../build')))
// app.get('/',function(req,res){
//     res.sendFile(path.join(__dirname,'../build/index.html'))
// })

// //주석
    app.listen(port, function () {
        console.log(`Server listening on port ${port}!`);
    });
});

<<<<<<< HEAD
app.get('/', function(req, res){ 
    res.sendFile(__dirname+'/bin/index.html')
}); 
=======
//router 사용
// const Router=require("./routes/*.js");
const studyRouter = require("./routes/study");
const studylistRouter =require("./routes/studylist");
app.use('/study', studyRouter);
app.use('/studylist',studylistRouter);

//react bulid
app.use(express.static(path.join(__dirname,'../build')))
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'../build/index.html'))
})
>>>>>>> 11c71fd066ee4d52258580b4343b04ba924dae15

// router 사용
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);
