var express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController')

router.post('/kakao', UserController.saveUser)
router.post('/nickname', UserController.saveNickname)


module.exports = router;