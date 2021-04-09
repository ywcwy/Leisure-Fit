const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('./modules/auth')
const leisurefitController = require('../controller/leisurefitController')
const adminController = require('../controller/adminController')
const userController = require('../controller/userController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const authenticated = (req, res, next) => {
  if (req.isAuthenticated()) { return next() }
  res.redirect('/login')
}
const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
  }
  res.redirect('/login')
}

router.use('/auth', auth)

// 公開資訊
router.get('/location', leisurefitController.googleMap)

//註冊、登入、登出
router.get('/register', userController.registerPage)
router.post('/register', userController.register)
router.get('/login', userController.logInPage)
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), userController.logIn)
router.get('/logout', userController.logout)

// 前台頁面
router.get('/', (req, res) => res.redirect('/leisurefits'))
router.get('/leisurefits', authenticated, leisurefitController.getLeisures)



// 後台頁面
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/leisurefits'))
router.get('/admin/leisurefits', authenticatedAdmin, adminController.getLeisurefits)
router.get('/admin/leisurefits/create', authenticatedAdmin, adminController.createLeisurefit)
router.get('/admin/leisurefits/:id', authenticatedAdmin, adminController.getLeisurefit)
router.post('/admin/leisurefits', authenticatedAdmin, upload.single('image'), adminController.postLeisurefit)
router.get('/admin/leisurefits/:id/edit', authenticatedAdmin, adminController.createLeisurefit)
router.put('/admin/leisurefits/:id', authenticatedAdmin, upload.single('image'), adminController.putLeisurefit)
router.delete('/admin/leisurefits/:id', authenticatedAdmin, adminController.deleteLeisurefit)

module.exports = router