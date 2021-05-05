const db = require('../models')
const { Category, User, Trainingday, Training, Equipment, Exercise, Workout } = db
const moment = require('moment')

const traineeController = {
  getTrainees: async (req, res) => {
    try {
      const trainees = await User.findAll({ where: { isAdmin: 0 }, raw: true })
      return res.render('admin/trainee', { trainees })
    } catch (error) { console.log(error) }
  },
  getTraineeRecord: async (req, res) => {
    try {
      const trainee = await User.findAll({
        where: { id: req.params.id }, raw: true, nest: true,
        include: [{ model: Trainingday, as: 'CoursesList' }]
      })
      const coursesdates = trainee.map(d => { return d.CoursesList.id })
      let trainings = await Promise.all(coursesdates.map(async (c) => {
        try {
          const records = await Workout.findAll({
            where: { TrainingdayId: Number(c) }, raw: true, nest: true,
            include: [{ model: Trainingday, include: [Category] }, { model: Training, include: [Exercise, Equipment] }]
          })
          let date = {}
          let category = ''
          let workout = records.map(r => {
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
          })
          return { date, category, workout }
        } catch (error) { console.log('error from workout ' + error) }
      }))
      return res.render('admin/traineeRecord', { trainings, name: trainee[0].name })
    } catch (error) { console.log(error) }
  },
  deleteTrainee: async (req, res) => {
    try {
      await User.destroy({ where: { id: req.params.id } })
      req.flash('success_msg', '成功刪除學員')
      return res.redirect('/admin/trainees')
    } catch (error) { console.log(error) }
  }
}

module.exports = traineeController