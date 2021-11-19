const express = require('express');
const app = express();
//post 받아오기 위해 body-parser 사용
app.use(express.urlencoded({ extended: false }))

//react ajax 통신
app.use(express.json());
const cors = require('cors');
app.use(cors());

const path = require('path');
require('dotenv').config();

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// multer 
const multer = require('multer')
const fs = require('fs'); // 업로드될 파일을 저장할 폴더를 생성하기 위해서만 사용

// DB connection
const id = process.env.DBid
const pwd = process.env.DBpwd

// userId auto-increment
var autoIncrement = require('mongoose-auto-increment');
const mongoose = require("mongoose");
var connection = mongoose.connection;
mongoose.connect(`mongodb://${id}:${pwd}@13.209.66.117:27017/admin`, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) {
        console.error("mongoDB Connection Error!", err);
    }
    console.log("mongoDB Connected!");

    // Server Open
    app.listen(8080, function () {
        var dir = './uploadedFiles';
        if(!fs.existsSync(dir)) // 폴더가 존재하는지 확인 하고 없으면 생성
            fs.mkdirSync(dir);

        console.log("Server listening on port 8080!");
    });
});
autoIncrement.initialize(connection);

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

// router 사용
const authRouter = require('./routes/auth');
app.use('/auth', authRouter);

const userRouter = require('./routes/users');
app.use('/users', userRouter);

// multer 세팅 
// const fileRouter = require('./routes/files');
// app.use('/files', fileRouter);

// var storage  = multer.diskStorage({ // 2 : 업로드한 파일명을 유지하기 위해 필요한 변수
//     destination(req, file, cb) {
//       cb(null, 'uploadedFiles/');
//     },
//     filename(req, file, cb) {
//       cb(null, `${Date.now()}__${file.originalname}`); 
//       /*
//         업로드된 파일명과 서버의 파일명이 완전히 동일하게 되면 
//         중복된 파일 업로드에서 문제가 생길 수 있으니 
//         파일명 앞에 시간을 정수로 달아줬습니다 
//       */
//     },
//   });
//   var upload = multer({ dest: 'uploadedFiles/' }); // 3-1
//   var uploadWithOriginalFilename = multer({ storage: storage }); // 3-2
  
//   router.get('/', function(req,res){
//     res.render('upload');
// });




