const db = require('../models')
const { Category, User, Trainingday, Exercise, Equipment, Training, Workout, Record } = db
const moment = require('moment')

const courseController = {
  getTrainingDays: async (req, res) => {
    let trainingdays = await Trainingday.findAll({ raw: true, nest: true, include: [Category] })
    trainingdays = trainingdays.map(t => {
      return {
        ...t,
        date: moment(t.date).format('YYYY-MM-DD')
      }
    })
    res.render('admin/courses', { trainingdays })
  },
  getExercises: async (req, res) => {
    const exercises = await Exercise.findAll({ raw: true })
    res.render('admin/courses', { exercises })
  },
  getEquipments: async (req, res) => {
    const equipments = await Equipment.findAll({ raw: true })
    res.render('admin/courses', { equipments })
  },
  getTrainings: async (req, res) => {
    const trainings = await Training.findAll({ raw: true, nest: true, include: [Exercise, Equipment] })
    res.render('admin/courses', { trainings })
  }
}








module.exports = courseController