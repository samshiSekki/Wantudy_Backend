const router = require('express').Router();
const StudyController = require('../controllers/StudyController')

//스터디 리스트 조회
router.get('/',StudyController.showStudy)
//스터디 상세 조회
router.get('/:studyId/details',StudyController.detailStudy)

module.exports = router;