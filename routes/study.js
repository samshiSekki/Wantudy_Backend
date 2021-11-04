const express = require('express');
const router = express.Router();
const ApplicationController = require('../controllers/ApplicationController')

// 스터디 지원서 조회
router.get('/application', ApplicationController.showApplication)

// 스터디 지원서 작성
router.post('/application', ApplicationController.saveApplication)

// 스터디 지원서 상세 보기
router.get('/application/:applicationId', ApplicationController.detailApplication)

// 스터디 지원서 등록
router.post('/:studyId/application', ApplicationController.registerApplication)

//  스터디 지원서 수정
router.put('/application/:applicationId', ApplicationController.updateApplication)

// 스터디 지원서 삭제
router.delete('/application/:applicationId', ApplicationController.deleteApplication)



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