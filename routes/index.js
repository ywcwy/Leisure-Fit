const express = require('express')
const router = express.Router()
const passport = require('passport')
const auth = require('./modules/auth')
const line = require('./modules/line')
const leisurefitController = require('../controller/leisurefitController')
const adminController = require('../controller/adminController')
const userController = require('../controller/userController')
const categoryController = require('../controller/categoryController')
const likeController = require('../controller/likeController')
const profileController = require('../controller/profileController')

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
router.use('/line', line)

// 公開頁面
router.get('/', (req, res) => res.redirect('/leisurefits'))
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
router.get('/logout', userController.logout)

// 前台需登入頁面
// 收藏貼文
router.post('/user/like/:id', authenticated, likeController.addLike)
router.delete('/user/like/:id', authenticated, likeController.removeLike)

// profile
router.get('/user/profile', authenticated, profileController.getProfile)
router.get('/user/likedLeisurefits', authenticated, profileController.getLikedLeisurefits)
router.delete('/user/likedLeisurefits/:id', authenticated, profileController.removeLikedLeisurefits)

// 後台頁面
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/leisurefits'))
router.get('/admin/leisurefits', authenticatedAdmin, adminController.getLeisurefits)
router.get('/admin/leisurefits/create', authenticatedAdmin, adminController.createLeisurefit)
router.get('/admin/leisurefits/:id', authenticatedAdmin, adminController.getLeisurefit)
router.post('/admin/leisurefits', authenticatedAdmin, upload.single('image'), adminController.postLeisurefit)
router.get('/admin/leisurefits/:id/edit', authenticatedAdmin, adminController.createLeisurefit)
router.put('/admin/leisurefits/:id', authenticatedAdmin, upload.single('image'), adminController.putLeisurefit)
router.delete('/admin/leisurefits/:id', authenticatedAdmin, adminController.deleteLeisurefit)

// 編輯分類
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/category', authenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.editCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

module.exports = router