const express = require('express')
const router = express.Router()
const passport = require('passport')

const leisurefitController = require('../controller/leisurefitController')
const adminController = require('../controller/adminController')
const userController = require('../controller/userController')

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/login')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
    res.redirect('/')
  }
  res.redirect('/login')
}

router.get('/', (req, res) => res.redirect('/leisurefits'))
router.get('/leisurefits', authenticated, leisurefitController.getLeisures)

router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.logInPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.logIn)

router.get('/admin/leisurefits', authenticatedAdmin, adminController.getLeisures)


module.exports = router