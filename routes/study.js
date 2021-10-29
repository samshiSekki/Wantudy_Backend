const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/ApplicationController')

// router.get('/application', ApplicationController.createApplication)
// router.post('/application', ApplicationController.saveApplication)

const StudyController = require('../controllers/StudyController')

//스터디 개설 페이지 보여주기
router.get('/', StudyController.createStudy)
//스터디 개설 등록 
router.post('/',  StudyController.saveStudy)
//router.post('/:studyId',StudyController.insert)
//router.get('/application',StudyController.getApplication)
//스터디 검색하기
router.get('/search', StudyController.searchStudy)

module.exports = router;