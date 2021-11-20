var router = require('express').Router();
const StudyController = require('../controllers/StudyController') 
const CommentController = require('../controllers/CommentController')

//스터디 리스트 조회
router.get('/', StudyController.showStudy)
//스터디 찜하기
router.post('/:studyId', StudyController.likeStudy)
router.delete('/:studyId/cancel-like',StudyController.deleteLike)
//스터디 상세 조회
router.get('/:studyId', StudyController.detailStudy)
//스터디 삭제
router.delete('/:studyId', StudyController.deleteStudy)
//스터디 수정
router.put('/:studyId', StudyController.updateStudy)
//채팅
router.get('/:studyId/chat', StudyController.chatStudy)
//스터디 신고(사유 저장)
router.post('/:studyId/report',StudyController.saveReport)
//댓글 작성
router.post('/:studyId/comment',CommentController.writeComment)
//댓글 삭제
router.delete('/:commentId/comment', CommentController.deleteComment)
//댓글 수정
router.patch('/:commentId/comment',CommentController.updateComment)
//대댓글 작성
router.post('/:commentId/recomment',CommentController.reComment)


module.exports = router;