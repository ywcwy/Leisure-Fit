const db = require('../models')
const { Category, User, Trainingday, Exercise, Equipment, Training, Workout, Record } = db
const moment = require('moment')

const courseController = {
  // 課程日
  getTrainingDays: async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    let trainingdays = await Trainingday.findAll({ raw: true, nest: true, include: [Category] })
    trainingdays = trainingdays.map(t => {
      return {
        ...t,
        date: moment(t.date).format('YYYY-MM-DD')
      }
    })
    let trainingday = {}
    if (req.params.id) {
      trainingday = await Trainingday.findByPk(req.params.id, { raw: true })
      trainingday.date = moment(trainingday.date).format('YYYY-MM-DD')
    }
    res.render('admin/courses', { trainingdays, categories, trainingday })
  },
  postTrainingDay: (req, res) => {
    const { date, categoryId, duration } = req.body
    Trainingday.create({ date, CategoryId: Number(categoryId), duration })
      .then(() => {
        req.flash('success_msg', '課程日新增成功。')
        res.redirect('/admin/courses/trainingdays')
      })
  },
  putTrainingDay: (req, res) => {
    const { date, categoryId, duration } = req.body
    Trainingday.update({ date, CategoryId: Number(categoryId), duration }, { where: { id: req.params.id } })
      .then(() => {
        req.flash('success_msg', '課程日修改成功。')
        res.redirect('/admin/courses/trainingdays')
      })
  },
  deleteTrainingDay: (req, res) => {
    Trainingday.destroy({ where: { id: req.params.id } })
      .then(() => {
        req.flash('success_msg', '課程日刪除成功。')
        res.redirect('/admin/courses/trainingdays')
      })
  },

  // 動作項目
  getExercises: async (req, res) => {
    const exercises = await Exercise.findAll({ raw: true })
    let exercise = {}
    if (req.params.id) { exercise = await Exercise.findByPk(req.params.id, { raw: true }) }
    res.render('admin/courses', { exercises, exercise })
  },
  postExercise: (req, res) => {
    const { move, description } = req.body
    Exercise.create({ move, description })
      .then(() => {
        req.flash('success_msg', '動作項目新增成功。')
        res.redirect('/admin/courses/exercises')
      })
  },
  putExercise: (req, res) => {
    const { move, description } = req.body
    Exercise.update({ move, description }, { where: { id: req.params.id } })
      .then(() => {
        req.flash('success_msg', '動作項目修改成功。')
        res.redirect('/admin/courses/exercises')
      })
  },
  deleteExercise: (req, res) => {
    Exercise.destroy({ where: { id: req.params.id } })
      .then(() => {
        req.flash('success_msg', '動作項目刪除成功。')
        res.redirect('/admin/courses/exercises')
      })
  },

  // 器材項目
  getEquipments: async (req, res) => {
    const equipments = await Equipment.findAll({ raw: true })
    let equipment = {}
    if (req.params.id) { equipment = await Equipment.findByPk(req.params.id, { raw: true }) }
    res.render('admin/courses', { equipments, equipment })
  },
  postEquipment: (req, res) => {
    const { item, description } = req.body
    Equipment.create({ item, description })
      .then(() => {
        req.flash('success_msg', '器材新增成功。')
        res.redirect('/admin/courses/equipments')
      })
  },
  putEquipment: (req, res) => {
    const { item, description } = req.body
    Equipment.update({ item, description }, { where: { id: req.params.id } })
      .then(() => {
        req.flash('success_msg', '器材更新成功。')
        res.redirect('/admin/courses/equipments')
      })
  },
  deleteEquipment: (req, res) => {
    Equipment.destroy({ where: { id: req.params.id } })
      .then(() => {
        req.flash('success_msg', '器材刪除成功。')
        res.redirect('/admin/courses/equipments')
      })
  },

  // 訓練日的菜單
  getWorkouts: async (req, res) => {
    // const trainingdays = await Trainingday.findAll({ raw: true })
    // let workouts = await Promise.all(trainingdays.map(async (t) => {
    //   const trainings = await Workout.findAll({
    //     where: { TrainingdayId: t.id }, raw: true, nest: true,
    //     include: [{ model: Trainingday, include: [Category] }, { model: Training, include: [Exercise, Equipment] }]
    //   })
    //   console.log(trainings)
    //   console.log(trainings[0].Training)
    //   return {
    //     date: moment(t.date).format('YYYY-MM-DD'),
    //     trainings,
    //     length: trainings.length
    //   }
    // }))

    let workouts = await Workout.findAll({ raw: true, nest: true, include: [{ model: Trainingday, include: [Category] }, { model: Training, include: [Exercise, Equipment] }] })
    workouts = workouts.map(w => {
      return {
        ...w,
        date: moment(w.Trainingday.date).format('YYYY-MM-DD')
      }
    })
    res.render('admin/courses', { workouts })
  },
  createWorkout: async (req, res) => {
    let trainingdays = await Trainingday.findAll({ raw: true })
    trainingdays = trainingdays.map(t => {
      return {
        ...t,
        date: moment(t.date).format('YYYY-MM-DD')
      }
    })
    const exercises = await Exercise.findAll({ raw: true })
    const equipments = await Equipment.findAll({ raw: true })
    let workout = {}
    if (req.params.id) {
      const event = await Workout.findByPk(req.params.id, { raw: true })
      const trainingday = await Trainingday.findByPk(event.TrainingdayId, { raw: true })
      const training = await Training.findByPk(event.TrainingId, { raw: true })
      workout = {
        id: req.params.id,
        date: moment(trainingday.date).format('YYYY-MM-DD'),
        categoryId: trainingday.CategoryId,
        duration: trainingday.duration,
        exerciseId: training.ExerciseId,
        equipmentId: training.EquipmentId,
        repetitions: event.repetitions,
        sets: event.sets
      }
      console.log(workout)
    }
    res.render('admin/workoutCreate', { workout, trainingdays, exercises, equipments })
  },
  postWorkout: async (req, res) => {
    const { trainingdayId, exerciseId, equipmentId, repetitions, sets } = req.body
    const training = await Training.create({ ExerciseId: Number(exerciseId), Equipment: Number(equipmentId) })
    Workout.create({ TrainingdayId: Number(trainingdayId), TrainingId: Number(training.id), repetitions, sets })
      .then(() => {
        req.flash('success_msg', '訓練項目新增成功。')
        res.redirect('/admin/courses/workouts')
      })
  },
  putWorkout: async (req, res) => {
    const { trainingdayId, exerciseId, equipmentId, repetitions, sets } = req.body
    const workout = await Workout.findByPk(req.params.id, { raw: true })
    Promise.all([
      Training.update({ ExerciseId: Number(exerciseId), EquipmentId: Number(equipmentId) }, { where: { id: workout.TrainingId } }),
      Workout.update({ repetitions, sets }, { where: { id: req.params.id } })
    ])
      .then(() => {
        req.flash('success_msg', '訓練項目更新成功。')
        res.redirect('/admin/courses/workouts')
      })
  },
  deleteWorkout: async (req, res) => {
    const workout = await Workout.findByPk(req.params.id)
    Promise.all([
      Trainingday.destroy({ where: { id: workout.TrainingdayId } }),
      workout.destroy()
    ]).then(() => {
      req.flash('success_msg', '訓練項目刪除成功。')
      res.redirect('/admin/courses/workouts')
    })

  }
}








module.exports = courseController