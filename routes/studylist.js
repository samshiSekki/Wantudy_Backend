var router = require('express').Router();
const StudyController = require('../controllers/StudyController')

//스터디 리스트 조회
router.get('/', StudyController.showStudy)
//스터디 상세 조회
router.get('/:studyId', StudyController.detailStudy)
//스터디 삭제
router.delete('/:studyId', StudyController.deleteStudy)
//스터디 수정
router.put('/:studyId', StudyController.updateStudy)

module.exports = router;