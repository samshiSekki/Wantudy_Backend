const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController')

// 유저 정보 조회
router.get('/:userId', UserController.showUser)

// 닉네임 수정
router.post('/:userId/profile', UserController.editNickname)

// 스터디 지원서 조회
router.get('/:userId/application', UserController.showApplication)

// 찜한 스터디 조회
router.get('/:userId/like-studylist', UserController.likeStudyList)

// 신청한 스터디 조회
router.get('/:userId/apply-studylist', UserController.applyStudyList)

// 개설한 스터디 조회
router.get('/:userId/opened-studylist', UserController.openedStudyList)

// 개설한 스터디 상세보기 지원서 조회 - 스터디원 수락/거절 
router.put('/:userId/opened-studylist/:applicationId', UserController.manageMember)

// 참여 스터디 조회 
router.get('/:userId/ongoing-studylist', UserController.ongoingStudyList)

// 과제 부여
router.post('/:userId/opened-studylist/{studyId}/assignment', UserController.giveAssignment)

// 과제 관리 - 해야할 과제 조회 (내가 신청한 스터디에서 부여한 과제)
router.get('/:userId/assignment', UserController.manageAssignment);

//참여 스터디 일정 조율
router.get('/:userId/ongoing-studylist/:studyId/schedule', UserController.schedule)
router.post('/:userId/ongoing-studylist/:studyId/schedule', UserController.scheduleSave)

router.get('/:userId/ongoing-studylist/:studyId/schedule-common', UserController.scheduleCommon)

module.exports = router;