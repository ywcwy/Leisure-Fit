const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../../controller/userController')

router.get('/line', passport.authenticate('line'))

router.get('/line/return', passport.authenticate('line', { failureRedirect: '/login' }),
  userController.lineLogin)



module.exports = router