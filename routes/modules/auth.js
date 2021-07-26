const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../../controller/userController')



router.get('/line', passport.authenticate('line'))

// 驗證後，重新導向的頁面URL
router.get('/line/return', passport.authenticate('line', { failureRedirect: '/login' }), userController.logIn)



module.exports = router