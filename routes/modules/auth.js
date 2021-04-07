const express = require('express')
const router = express.Router()

const passport = require('passport')

router.get('/line', passport.authenticate('line', {
  scope: ['email', 'profile', 'openid']  // scope的值為我們向line要求的資料
}))

router.get('/line/callback', passport.authenticate('line', {
  successRedirect: '/',
  failureRedirect: '/login'
}))



module.exports = router