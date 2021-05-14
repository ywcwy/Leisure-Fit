const express = require('express')
const router = express.Router()
const adminController = require('../../controller/adminController')
const categoryController = require('../../controller/categoryController')
const courseController = require('../../controller/courseController')
const traineeController = require('../../controller/traineeController')
const trainingdayController = require('../../controller/trainingdayController')
const exerciseController = require('../../controller/exerciseController')
const equipmentController = require('../../controller/equipmentController')
const workoutController = require('../../controller/workoutController')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const authenticatedAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.isAdmin) { return next() }
  }
  res.redirect('/login')
}


// 後台編輯貼文
router.get('/', authenticatedAdmin, (req, res) => res.redirect('/admin/leisurefits'))
router.get('/leisurefits', authenticatedAdmin, adminController.getLeisurefits)
router.get('/leisurefits/create', authenticatedAdmin, adminController.createLeisurefit)
router.get('/leisurefits/:id', authenticatedAdmin, adminController.getLeisurefit)
router.post('/leisurefits', authenticatedAdmin, upload.single('image'), adminController.postLeisurefit)
router.get('/leisurefits/:id/edit', authenticatedAdmin, adminController.createLeisurefit)
router.put('/leisurefits/:id', authenticatedAdmin, upload.single('image'), adminController.putLeisurefit)
router.delete('/leisurefits/:id', authenticatedAdmin, adminController.deleteLeisurefit)

// 後台編輯課程（大分類）
router.get('/categories', authenticatedAdmin, categoryController.getCategories)
router.get('/categories/:id', authenticatedAdmin, categoryController.getCategories)
router.post('/category', authenticatedAdmin, categoryController.postCategory)
router.put('/categories/:id', authenticatedAdmin, categoryController.editCategory)
router.delete('/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

// 後台刪除學員
router.get('/trainees', authenticatedAdmin, traineeController.getTrainees)
router.get('/trainees/:id/records', authenticatedAdmin, traineeController.getTraineeRecord)
router.delete('/trainees/:id', authenticatedAdmin, traineeController.deleteTrainee)


// 後台編輯訓練課程 (細項)
router.get('/courses', authenticatedAdmin, trainingdayController.getTrainingDays)
// 後台編輯訓練課程日期
router.get('/courses/trainingdays', authenticatedAdmin, trainingdayController.getTrainingDays)
router.post('/courses/trainingdays', authenticatedAdmin, trainingdayController.postTrainingDay)
router.get('/courses/trainingdays/:id', authenticatedAdmin, trainingdayController.getTrainingDays)
router.put('/courses/trainingdays/:id', authenticatedAdmin, trainingdayController.putTrainingDay)
router.delete('/courses/trainingdays/:id', authenticatedAdmin, trainingdayController.deleteTrainingDay)

// 後台開放課程報名
router.get('/courses/enroll/:id', authenticatedAdmin, courseController.handleEnrollment)
// 後台查看正備取名單
router.get('/courses/enroll/:id/enrollers', authenticatedAdmin, courseController.getEnrollers)
// 後台取消正備取
router.delete('/courses/enroll/:trainingdayId/enrollers/:userId', authenticatedAdmin, courseController.deleteEnrollers)
router.delete('/courses/enroll/:trainingdayId/waitings/:userId', authenticatedAdmin, courseController.deleteWaitings)

// 後台編輯訓練動作
router.get('/courses/exercises', authenticatedAdmin, exerciseController.getExercises)
router.post('/courses/exercises', authenticatedAdmin, exerciseController.postExercise)
router.get('/courses/exercises/:id', authenticatedAdmin, exerciseController.getExercises)
router.put('/courses/exercises/:id', authenticatedAdmin, exerciseController.putExercise)
router.delete('/courses/exercises/:id', authenticatedAdmin, exerciseController.deleteExercise)


// 後台編輯訓練器材
router.get('/courses/equipments', authenticatedAdmin, equipmentController.getEquipments)
router.post('/courses/equipments', authenticatedAdmin, equipmentController.postEquipment)
router.get('/courses/equipments/:id', authenticatedAdmin, equipmentController.getEquipments)
router.put('/courses/equipments/:id', authenticatedAdmin, equipmentController.putEquipment)
router.delete('/courses/equipments/:id', authenticatedAdmin, equipmentController.deleteEquipment)

// 後台編輯訓練課程菜單
router.get('/courses/workouts', authenticatedAdmin, workoutController.getWorkouts)
router.get('/courses/workouts/create', authenticatedAdmin, workoutController.createWorkout)
router.post('/courses/workouts', authenticatedAdmin, workoutController.postWorkout)
router.get('/courses/workouts/:id', authenticatedAdmin, workoutController.createWorkout)
router.put('/courses/workouts/:id', authenticatedAdmin, workoutController.putWorkout)
router.delete('/courses/workouts/:id', authenticatedAdmin, workoutController.deleteWorkout)



module.exports = router