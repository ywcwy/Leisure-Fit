const db = require('../models')
const { Category, User, Trainingday, Training, Equipment, Exercise, Workout } = db
const formatDate = require('../config/formatDate')
const formatTime = require('../config/formatTime')

const traineeController = {
  getTrainees: async (req, res) => {
    const trainees = await User.findAll({ where: { isAdmin: 0 }, raw: true })
    return res.render('admin/trainee', { trainees })
  },
  getTraineeRecord: async (req, res) => {
    const trainee = await User.findAll({
      where: { id: req.params.id }, include: [{ model: Trainingday, as: 'CoursesList' }], raw: true, nest: true,
    })
    const coursesdates = trainee.map(d => { return d.CoursesList.id })
    let trainings = await Promise.all(coursesdates.map(async (c) => {
      const records = await Workout.findAll({
        where: { TrainingdayId: c }, raw: true, nest: true,
        include: [{ model: Trainingday, include: [Category] }, { model: Training, include: [Exercise, Equipment] }]
      })

      let training = {}
      let workout = records.map(r => {
        training.date = formatDate(r.Trainingday.date)
        training.time = formatTime(r.Trainingday.time)
        training.category = r.Trainingday.Category.name
        training.day = r.Trainingday.Category.day_CH
        return {
          exercise: r.Training.Exercise.move,
          exerciseDescription: r.Training.Exercise.description,
          equipment: r.Training.Equipment.item,
          equipmentDescription: r.Training.Equipment.description,
          repetitions: r.repetitions,
          sets: r.sets
        }
      })
      return { training, workout }
    }))
    return res.render('admin/traineeRecord', { trainings, name: trainee[0].name })
  },
  deleteTrainee: async (req, res) => {
    await User.destroy({ where: { id: req.params.id } })
    req.flash('success_msg', '成功刪除學員')
    return res.redirect('back')
  }
}

module.exports = traineeController