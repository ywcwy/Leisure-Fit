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
const courseController = require('../controller/courseController')

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
router.get('/logout', userController.logOut)

// 前台需登入頁面
// 收藏貼文
router.post('/user/like/:id', authenticated, likeController.addLike)
router.delete('/user/like/:id', authenticated, likeController.removeLike)

// profile
router.get('/user/profile', authenticated, profileController.getProfile)
router.get('/user/training', authenticated, profileController.getRecords)
router.get('/user/training/create', authenticated, profileController.createRecord)
router.post('/user/training/records', authenticated, upload.single('image'), profileController.postRecord)
router.get('/user/training/records/:id', authenticated, profileController.getRecord)
router.get('/user/training/records/:id/edit', authenticated, profileController.createRecord)
router.put('/user/training/records/:id', authenticated, upload.single('image'), profileController.putRecord)

router.get('/user/likedLeisurefits', authenticated, profileController.getLikedLeisurefits)
router.delete('/user/likedLeisurefits/:id', authenticated, profileController.removeLikedLeisurefits)

// 後台頁面
// 後台編輯貼文
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/leisurefits'))
router.get('/admin/leisurefits', authenticatedAdmin, adminController.getLeisurefits)
router.get('/admin/leisurefits/create', authenticatedAdmin, adminController.createLeisurefit)
router.get('/admin/leisurefits/:id', authenticatedAdmin, adminController.getLeisurefit)
router.post('/admin/leisurefits', authenticatedAdmin, upload.single('image'), adminController.postLeisurefit)
router.get('/admin/leisurefits/:id/edit', authenticatedAdmin, adminController.createLeisurefit)
router.put('/admin/leisurefits/:id', authenticatedAdmin, upload.single('image'), adminController.putLeisurefit)
router.delete('/admin/leisurefits/:id', authenticatedAdmin, adminController.deleteLeisurefit)

// 後台編輯課程（大分類）
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/category', authenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.editCategory)
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

// 後台編輯訓練課程 (細項)
router.get('/admin/courses', authenticatedAdmin, courseController.getTrainingDays)

router.get('/admin/courses/trainingdays', authenticatedAdmin, courseController.getTrainingDays)
router.post('/admin/courses/trainingdays', authenticatedAdmin, courseController.postTrainingDay)
router.get('/admin/courses/trainingdays/:id', authenticatedAdmin, courseController.getTrainingDays)
router.put('/admin/courses/trainingdays/:id', authenticatedAdmin, courseController.putTrainingDay)
router.delete('/admin/courses/trainingdays/:id', authenticatedAdmin, courseController.deleteTrainingDay)

router.get('/admin/courses/exercises', authenticatedAdmin, courseController.getExercises)
router.post('/admin/courses/exercises', authenticatedAdmin, courseController.postExercise)
router.get('/admin/courses/exercises/:id', authenticatedAdmin, courseController.getExercises)
router.put('/admin/courses/exercises/:id', authenticatedAdmin, courseController.putExercise)
router.delete('/admin/courses/exercises/:id', authenticatedAdmin, courseController.deleteExercise)

router.get('/admin/courses/equipments', authenticatedAdmin, courseController.getEquipments)
router.post('/admin/courses/equipments', authenticatedAdmin, courseController.postEquipment)
router.get('/admin/courses/equipments/:id', authenticatedAdmin, courseController.getEquipments)
router.put('/admin/courses/equipments/:id', authenticatedAdmin, courseController.putEquipment)
router.delete('/admin/courses/equipments/:id', authenticatedAdmin, courseController.deleteEquipment)

router.get('/admin/courses/workouts', authenticatedAdmin, courseController.getWorkouts)
router.get('/admin/courses/workouts/create', authenticatedAdmin, courseController.createWorkout)
router.post('/admin/courses/workouts', authenticatedAdmin, courseController.postWorkout)
router.get('/admin/courses/workouts/:id', authenticatedAdmin, courseController.createWorkout)
router.put('/admin/courses/workouts/:id', authenticatedAdmin, courseController.putWorkout)
router.delete('/admin/courses/workouts/:id', authenticatedAdmin, courseController.deleteWorkout)

module.exports = router