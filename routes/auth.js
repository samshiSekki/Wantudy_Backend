const express = require('express');
const router = express.Router();
const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy;

// auth/kakao 로 요청을 보내면 new KakaoStrategy를 통해서 ClientID를 담아 카카오 서버로 인증을 요청
passport.use('kakao', new KakaoStrategy({
    clientID: '86d130c8c94c8dbcbb6c5756050fbaae',
    callbackURL: '/auth/kakao/callback',     // 위에서 설정한 Redirect URI
  }, async (accessToken, refreshToken, profile, done) => {
    console.log(accessToken);
    console.log(refreshToken);
}))

router.get('/kakao', passport.authenticate('kakao'));

// 인증이 성공하면 /auth/kakao/callback으로 응답이 옴 (accessToken, refreshToken, profile)
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (res, req) => {
  res.redirect('/auth');
});

module.exports = router;