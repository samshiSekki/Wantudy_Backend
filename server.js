const express = require('express');
const app= express();
//post 받아오기 위해 body-parser 사용
app.use(express.urlencoded({extended:false})) 
app.use(express.json());

const path = require('path');
const http = require('http').createServer(app);
const {Server}=require("socket.io");
const io = new Server(http);
require('dotenv').config();
const cors=require('cors');
app.use(cors());

// const { endianness } = require('os');

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

// DB connection
var id = process.env.DBid
var pwd = process.env.DBpwd

var mongoose = require("mongoose");
mongoose.connect(`mongodb://${id}:${pwd}@13.209.66.117:27017/admin`,{useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err){
        console.error("mongoDB Connection Error!", err);
    }
    console.log("mongoDB Connected!");
    
    // Server Open
    http.listen(8080, function(){
        console.log("Server listening on port 8080!");
    });
});

app.get('/',function(요청, 응답){
    응답.send('홈입니다')
});

//router 사용
const studyRouter = require("./routes/study");
app.use('/study',studyRouter);

//app.use('/study',require('./routes/study.js'))
//app.use(require('./routes'))

//react bulid
// app.use(express.static(path.join(__dirname,'../build')))
// app.get('/',function(req,res){
//     res.sendFile(path.join(__dirname,'../build/index.html'))
// })