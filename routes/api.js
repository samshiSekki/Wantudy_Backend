var express = require("express")
var studyRouter = require("./study");

var app=express();

app.use("/study/",studyRouter);

module.exports=app;