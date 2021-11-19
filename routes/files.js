const express = require('express');
const router = express.Router();
const multer = require('multer'); // 1

var storage  = multer.diskStorage({ // 2
  destination(req, file, cb) {
    cb(null, 'uploadedFiles/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}__${file.originalname}`);
  },
});

// var upload = multer({ dest: 'uploadedFiles/' }); // 3-1

// 3-2 : 2번에서 만든 storage를 넣어서 저장될 파일의 이름을 유지하는 미들웨어
var uploadWithOriginalFilename = multer({ storage: storage }); 

router.get('/', function(req,res){
  res.render('upload');
});

// // 4 : 기본 설정으로 하나의 파일 업로드 처리
// router.post('/uploadFile', upload.single('attachment'), function(req,res){ 
//   res.render('confirmation', { file:req.file, files:null });
// });

// 파일명이 바뀌지 않도록 uploadWithOriginalFilename을 사용하였고 
// 하나의 파일을 처리하기 위해 uploadWithOriginalFilename.single()을 사용
router.post('/uploadFileWithOriginalFilename', uploadWithOriginalFilename.single('attachment'), function(req,res){ // 5
  res.render('confirmation', { file:req.file, files:null }); 
  // .single()을 사용해서 하나의 파일을 올린 경우 req.file에 업로드된 하나의 파일의 정보가 저장
});

// router.post('/uploadFiles', upload.array('attachments'), function(req,res){ // 6
//   res.render('confirmation', { file: null, files:req.files} );
// });

// router.post('/uploadFilesWithOriginalFilename', uploadWithOriginalFilename.array('attachments'), function(req,res){ // 7
//   res.render('confirmation', { file:null, files:req.files });
// });

module.exports = router;