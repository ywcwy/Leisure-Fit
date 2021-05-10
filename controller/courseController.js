const db = require('../models')
const { Category, Trainingday, Exercise, Equipment, Training, Workout, Enroll, WaitingList } = db
const moment = require('moment')

const courseController = {
  // 課程日
  getTrainingDays: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true })
      let trainingdays = await Trainingday.findAll({ raw: true, nest: true, include: [Category] })
      trainingdays = await Promise.all(trainingdays.map(async (t) => {
        return {
          ...t,
          date: moment(t.date).format('YYYY-MM-DD'),
          enrollNumbers: await Enroll.count({ where: { TrainingdayId: t.id } }),
          waitingNumbers: await WaitingList.count({ where: { TrainingdayId: t.id } }),
          time: moment(t.time, moment.HTML5_FMT.TIME).format("HH:mm")
        }
      }))
      let trainingday = {}
      if (req.params.id) {
        trainingday = await Trainingday.findByPk(req.params.id, { raw: true })
        trainingday.date = moment(trainingday.date).format('YYYY-MM-DD')
        trainingday.time = moment(trainingday.time, moment.HTML5_FMT.TIME).format("HH:mm")
      }
      return res.render('admin/courses', { trainingdays, categories, trainingday })
    } catch (error) { console.log(error) }
  },
  postTrainingDay: async (req, res) => {
    try {
      const { date, categoryId, time, limitNumber } = req.body
      await Trainingday.create({ date, CategoryId: Number(categoryId), time, limitNumber }, { raw: true })
      req.flash('success_msg', '新增成功。')
      return res.redirect('/admin/courses/trainingdays')
    } catch (error) { console.log(error) }
  },
  putTrainingDay: async (req, res) => {
    try {
      const { date, categoryId, time, limitNumber } = req.body
      await Trainingday.update({ date, CategoryId: Number(categoryId), time, limitNumber }, { where: { id: req.params.id } })
      req.flash('success_msg', '修改成功。')
      return res.redirect('/admin/courses/trainingdays')
    } catch (error) { console.log(error) }
  },
  deleteTrainingDay: async (req, res) => {
    try {
      await Trainingday.destroy({ where: { id: req.params.id } })
      req.flash('success_msg', '刪除成功。')
      return res.redirect('/admin/courses/trainingdays')
    } catch (error) { console.log(error) }
  },

  // 開放/截止報名日期
  handleEnrollment: async (req, res) => {
    const trainingDay = await Trainingday.findByPk(req.params.id)
    await trainingDay.update({ enroll: !trainingDay.enroll })
    return res.redirect('/admin/courses/trainingdays')
  },

  // 動作項目
  getExercises: async (req, res) => {
    try {
      const exercises = await Exercise.findAll({ raw: true })
      let exercise = {}
      if (req.params.id) { exercise = await Exercise.findByPk(req.params.id, { raw: true }) }
      return res.render('admin/courses', { exercises, exercise })
    } catch (error) { console.log(error) }
  },
  postExercise: async (req, res) => {
    try {
      const { move, description } = req.body
      await Exercise.create({ move, description })
      req.flash('success_msg', '動作項目新增成功。')
      return res.redirect('/admin/courses/exercises')
    } catch (error) { console.log(error) }
  },
  putExercise: async (req, res) => {
    try {
      const { move, description } = req.body
      await Exercise.update({ move, description }, { where: { id: req.params.id } })
      req.flash('success_msg', '動作項目修改成功。')
      return res.redirect('/admin/courses/exercises')
    } catch (error) { console.log(error) }
  },
  deleteExercise: async (req, res) => {
    try {
      Exercise.destroy({ where: { id: req.params.id } })
      req.flash('success_msg', '動作項目刪除成功。')
      return res.redirect('/admin/courses/exercises')
    } catch (error) { console.log(error) }
  },

  // 器材項目
  getEquipments: async (req, res) => {
    try {
      const equipments = await Equipment.findAll({ raw: true })
      let equipment = {}
      if (req.params.id) { equipment = await Equipment.findByPk(req.params.id, { raw: true }) }
      return res.render('admin/courses', { equipments, equipment })
    } catch (error) { console.log(error) }
  },
  postEquipment: async (req, res) => {
    try {
      const { item, description } = req.body
      await Equipment.create({ item, description })
      req.flash('success_msg', '器材新增成功。')
      return res.redirect('/admin/courses/equipments')
    } catch (error) { console.log(error) }
  },
  putEquipment: async (req, res) => {
    try {
      const { item, description } = req.body
      await Equipment.update({ item, description }, { where: { id: req.params.id } })
      req.flash('success_msg', '器材更新成功。')
      return res.redirect('/admin/courses/equipments')
    } catch (error) { console.log(error) }
  },
  deleteEquipment: async (req, res) => {
    try {
      await Equipment.destroy({ where: { id: req.params.id } })
      req.flash('success_msg', '器材刪除成功。')
      return res.redirect('/admin/courses/equipments')
    } catch (error) { console.log(error) }
  },

  // 訓練日的菜單
  getWorkouts: async (req, res) => {
    try {
      const trainingdays = await Trainingday.findAll({ raw: true })
      let trainings = await Promise.all(trainingdays.map(async (t) => {
        try {
          const workouts = await Workout.findAll({ //找每個訓練日的 workout 項目
            where: { TrainingdayId: t.id }, attributes: ['id', 'repetitions', 'sets'], raw: true, nest: true,
            include: [{ model: Trainingday, include: [Category] }, { model: Training, include: [Exercise, Equipment] }]
          })
          let date = moment(t.date).format('YYYY-MM-DD') // 訓練日
          let workout = workouts.map(w => {
            return {
              id: w.id,
              repetitions: w.repetitions,
              sets: w.sets,
              exercise: w.Training.Exercise.move,
              exerciseDescription: w.Training.Exercise.description,
              equipment: w.Training.Equipment.item,
              equipmentDescription: w.Training.Equipment.description
            }
          })
          return { date, workout }
        } catch (error) { console.log('error from workouts' + error) }
      }))
      return res.render('admin/courses', { trainings })
    } catch (error) { console.log(error) }
  },
  createWorkout: async (req, res) => {
    try {
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
        const event = await Workout.findOne({ where: { id: req.params.id }, raw: true })
        const trainingday = await Trainingday.findByPk(event.TrainingdayId, { raw: true })
        const training = await Training.findByPk(event.TrainingId, { raw: true })
        workout = {
          id: req.params.id,
          date: moment(trainingday.date).format('YYYY-MM-DD'),
          categoryId: trainingday.CategoryId,
          time: moment(trainingday.time, moment.HTML5_FMT.TIME).format("HH:mm"),
          exerciseId: training.ExerciseId,
          equipmentId: training.EquipmentId,
          repetitions: event.repetitions,
          sets: event.sets
        }
      }
      return res.render('admin/workoutCreate', { workout, trainingdays, exercises, equipments })
    } catch (error) { console.log(error) }
  },
  postWorkout: async (req, res) => {
    try {
      const { trainingdayId, exerciseId, equipmentId, repetitions, sets } = req.body
      const training = await Training.create({ ExerciseId: Number(exerciseId), Equipment: Number(equipmentId) })
      await Workout.create({ TrainingdayId: Number(trainingdayId), TrainingId: Number(training.id), repetitions, sets })
      req.flash('success_msg', '訓練項目新增成功。')
      return res.redirect('/admin/courses/workouts')
    } catch (error) { console.log(error) }
  },
  putWorkout: async (req, res) => {
    try {
      const { exerciseId, equipmentId, repetitions, sets } = req.body
      const workout = await Workout.findByPk(req.params.id, { raw: true })
      await Training.update({ ExerciseId: Number(exerciseId), EquipmentId: Number(equipmentId) }, { where: { id: workout.TrainingId } })
      await Workout.update({ repetitions, sets }, { where: { id: req.params.id } })
      req.flash('success_msg', '訓練項目更新成功。')
      return res.redirect('/admin/courses/workouts')
    } catch (error) { console.log(error) }
  },
  deleteWorkout: async (req, res) => {
    try {
      await Workout.destroy({ where: { id: req.params.id } })
      req.flash('success_msg', '訓練項目刪除成功。')
      return res.redirect('/admin/courses/workouts')
    } catch (error) { console.log(error) }
  }
}



module.exports = courseController