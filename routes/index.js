const express = require('express')
const router = express.Router()
const passport = require('passport')

const leisurefitController = require('../controller/leisurefitController')
const adminController = require('../controller/adminController')
const userController = require('../controller/userController')

router.get('/', (req, res) => res.redirect('/leisurefits'))
router.get('/leisurefits', leisurefitController.getLeisures)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.logInPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.logIn)

router.get('/admin/leisurefit', adminController.getLeisures)


module.exports = router