const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController')

// 닉네임 수정
router.post('/:userId/profile', UserController.editNickname)

// 찜한 스터디 조회
router.get('/:userId/like-studylist', UserController.likeStudyList)

// 신청한 스터디 조회
router.get('/:userId/apply-studylist', UserController.applyStudyList)

// 개설한 스터디 조회
router.get('/:userId/opened-studylist', UserController.openedStudyList)

// // 참여 스터디 조회 
// router.get('/:userId/total-studylist ', UserController.editUser)

// // 과제 관리
// router.get('/:userId/assignment', UserController.getAssignment);

// // 신청한 스터디 조회
// router.get('/:userId/apply-studylist', UserController.editUser)

// // 개설한 스터디 조회
// router.get('/:userId/opened-studylist', UserController.editUser)


module.exports = router;