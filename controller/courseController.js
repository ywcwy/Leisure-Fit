const db = require('../models')
const { Category, User, Trainingday, Exercise, Equipment, Training, Workout, Record } = db
const moment = require('moment')

const courseController = {
  getTrainingDays: async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    let trainingdays = await Trainingday.findAll({ raw: true, nest: true, include: [Category] })
    trainingdays = trainingdays.map(t => {
      return {
        ...t,
        date: moment(t.date).format('YYYY-MM-DD')
      }
    })
    let trainingday = ''
    if (req.params.id) {
      trainingday = await Trainingday.findByPk(req.params.id, { raw: true })
    }
    trainingday.date = moment(trainingday.date).format('YYYY-MM-DD')
    res.render('admin/courses', { trainingdays, categories, trainingday })
  },
  postTrainingDays: (req, res) => {
    const { date, categoryId, duration } = req.body
    Trainingday.create({ date, CategoryId: Number(categoryId), duration })
      .then(() => res.redirect('/admin/courses/trainingdays'))
  },
  putTrainingDays: async (req, res) => {
    const { date, categoryId, duration } = req.body
    Trainingday.update({ date, CategoryId: Number(categoryId), duration }, { where: { id: req.params.id } })
      .then(() => res.redirect('/admin/courses/trainingdays'))
  },
  deleteTrainingDays: (req, res) => {
    Trainingday.destroy({ where: { id: req.params.id } })
      .then(() => res.redirect('/admin/courses/trainingdays'))
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
  },
  getWorkouts: async (req, res) => {
    let workouts = await Workout.findAll({ raw: true, nest: true, include: [{ model: Trainingday, include: [Category] }, { model: Training, include: [Exercise] }] })
    workouts = workouts.map(w => {
      return {
        ...w,
        date: moment(w.Trainingday.date).format('YYYY-MM-DD')
      }
    })
    res.render('admin/courses', { workouts })
  }
}








module.exports = courseController