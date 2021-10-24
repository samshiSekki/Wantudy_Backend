const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController')

// app.post('/kakao', (req, res) => {
//   const email = req.body.email;
//   const profileImage = req.body.profileImage;
//   console.log(email, profileImage);
// });

router.post('/kakao', UserController.saveUser)


module.exports = router;