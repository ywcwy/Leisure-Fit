const db = require('../models')
const { Leisurefit, Category, User, Trainingday, Exercise } = db
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
  }
}








module.exports = courseController