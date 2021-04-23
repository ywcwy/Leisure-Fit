const db = require('../models')
const { Leisurefit, Category, User, Like, Record, Trainingday, Training, Equipment, Exercise, Workout } = db
const moment = require('moment')

const traineeController = {
  getTrainees: async (req, res) => {
    const trainees = await User.findAll({ where: { isAdmin: 0 }, raw: true })
    res.render('admin/trainee', { trainees })
  },
  getTraineeRecord: async (req, res) => {
    const trainee = await User.findAll({ where: { id: req.params.id }, raw: true, nest: true, include: [{ model: Trainingday, as: 'CoursesList' }] })
    const coursesdates = trainee.map(d => {
      return d.CoursesList.id
    })
    let trainings = await Promise.all(coursesdates.map(async (c) => {
      const records = await Workout.findAll({ where: { TrainingdayId: Number(c) }, raw: true, nest: true, include: [{ model: Trainingday, include: [Category] }, { model: Training, include: [Exercise, Equipment] }] })
      let date = {}
      let category = ''
      let training = {}
      let workout = await Promise.all(records.map((r, index) => {
        date = moment(r.Trainingday.date).format('YYYY-MM-DD')
        category = r.Trainingday.Category.name
        return {
          exercise: r.Training.Exercise.move,
          exerciseDescription: r.Training.Exercise.description,
          equipment: r.Training.Equipment.item,
          equipmentDescription: r.Training.Equipment.description,
          repetitions: r.repetitions,
          sets: r.sets
        }
      }))
      training.workout = workout
      training.date = date
      training.category = category
      return training
    }))
    console.log(trainings)
    res.render('admin/traineeRecord', { trainings, name: trainee[0].name })
  },
  deleteTrainee: (req, res) => {
    User.destroy({ where: { id: req.params.id } })
      .then(() => {
        req.flash('success_msg', '成功刪除學員')
        res.redirect('/admin/trainees')
      })
  }
}

module.exports = traineeController