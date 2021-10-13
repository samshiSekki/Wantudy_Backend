var router=require('express').Router();
const StudyController = require('../controllers/StudyController')

//스터디 추가 페이지
router.get('/',StudyController.createStudy)
//스터디 저장 
router.post('/',StudyController.saveStudy) 
//router.post('/:studyId',StudyController.insert)
//router.get('/application',StudyController.getApplication)

module.exports = router;