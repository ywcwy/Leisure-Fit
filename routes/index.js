const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('./modules/auth')
const line = require('./modules/line')
const user = require('./modules/user')
const admin = require('./modules/admin')
const leisurefitController = require('../controller/leisurefitController')
const userController = require('../controller/userController')

router.use('/auth', auth)
router.use('/line', line)
router.use('/user', user)
router.use('/admin', admin)

// 公開頁面
router.get('/', (req, res) => res.redirect('/index'))
router.get('/index', leisurefitController.getIndex)
router.get('/leisurefits', leisurefitController.getLeisurefits)
router.get('/location', leisurefitController.googleMap)
router.get('/calendar', leisurefitController.getCalendar)
router.get('/leisurefits/:id', leisurefitController.getLeisurefit)
router.get('/contactUs', leisurefitController.getContactUs)

//註冊、登入、登出
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.logInPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.logIn)
router.get('/logout', userController.logOut)

module.exports = router