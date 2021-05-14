const db = require('../models')
const { Category, Trainingday, Exercise, Equipment, Training, Workout } = db
const { formatDate, formatTime } = require('../config/formatDate&Time')


const workoutController = {
  getWorkouts: async (req, res) => {
    const trainingdays = await Trainingday.findAll({ raw: true })
    let trainings = await Promise.all(trainingdays.map(async (t) => {
      const workouts = await Workout.findAll({ //找每個訓練日的 workout 項目
        where: { TrainingdayId: t.id }, attributes: ['id', 'repetitions', 'sets'], raw: true, nest: true,
        include: [{ model: Trainingday, include: [Category] }, { model: Training, include: [Exercise, Equipment] }]
      })
      const date = formatDate(t.date) // 訓練日
      const workout = workouts.map(w => {
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
    }))
    return res.render('admin/courses', { trainings })
  },
  createWorkout: async (req, res) => {
    let [exercises, equipments, trainingdays] = await Promise.all([
      Exercise.findAll({ raw: true }), Equipment.findAll({ raw: true }), Trainingday.findAll({ raw: true })])
    trainingdays = trainingdays.map(t => {
      return {
        ...t,
        date: formatDate(t.date)
      }
    })
    let workout = {}
    if (req.params.id) {
      const event = await Workout.findOne({ where: { id: req.params.id }, raw: true })
      const [trainingday, training] = await Promise.all([
        Trainingday.findByPk(event.TrainingdayId, { raw: true }), Training.findByPk(event.TrainingId, { raw: true })])
      workout = {
        id: req.params.id,
        date: formatDate(trainingday.date),
        categoryId: trainingday.CategoryId,
        time: formatTime(trainingday.time),
        exerciseId: training.ExerciseId,
        equipmentId: training.EquipmentId,
        repetitions: event.repetitions,
        sets: event.sets
      }
    }
    return res.render('admin/workoutCreate', { workout, trainingdays, exercises, equipments })
  },
  postWorkout: async (req, res) => {
    const { trainingdayId, exerciseId, equipmentId, repetitions, sets } = req.body
    try {
      const training = await Training.create({ ExerciseId: Number(exerciseId), Equipment: Number(equipmentId) })
      await Workout.create({ TrainingdayId: Number(trainingdayId), TrainingId: Number(training.id), repetitions, sets })
    } catch (error) {
      req.flash('warning_msg', '訓練項目新增失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '訓練項目新增成功。')
    return res.redirect('back')
  },
  putWorkout: async (req, res) => {
    const { exerciseId, equipmentId, repetitions, sets } = req.body
    const workout = await Workout.findByPk(req.params.id, { raw: true })
    Training.update({ ExerciseId: Number(exerciseId), EquipmentId: Number(equipmentId) }, { where: { id: workout.TrainingId } })
    try {
      await Workout.update({ repetitions, sets }, { where: { id: req.params.id } })
    } catch (error) {
      req.flash('warning_msg', '訓練項目更新失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '訓練項目更新成功。')
    return res.redirect('/admin/courses/workouts')
  },
  deleteWorkout: async (req, res) => {
    try {
      await Workout.destroy({ where: { id: req.params.id } })
    } catch (error) {
      req.flash('warning_msg', '訓練項目刪除失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '訓練項目刪除成功。')
    return res.redirect('back')
  }
}

module.exports = workoutController