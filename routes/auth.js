const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController')

router.post('/kakao', AuthController.saveUser)
router.post('/nickname', AuthController.saveNickname)


module.exports = router;