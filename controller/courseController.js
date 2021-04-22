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
  postTrainingDays: (req, res) => {
    const { date, categoryId, duration } = req.body
    Trainingday.create({ date, CategoryId: Number(categoryId), duration })
      .then(() => {
        req.flash('success_msg', '課程日新增成功。')
        res.redirect('/admin/courses/trainingdays')
      })
  },
  putTrainingDays: (req, res) => {
    const { date, categoryId, duration } = req.body
    Trainingday.update({ date, CategoryId: Number(categoryId), duration }, { where: { id: req.params.id } })
      .then(() => {
        req.flash('success_msg', '課程日修改成功。')
        res.redirect('/admin/courses/trainingdays')
      })
  },
  deleteTrainingDays: (req, res) => {
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
  postExercises: (req, res) => {
    const { move, description } = req.body
    Exercise.create({ move, description })
      .then(() => {
        req.flash('success_msg', '動作項目新增成功。')
        res.redirect('/admin/courses/exercises')
      })
  },
  putExercises: (req, res) => {
    const { move, description } = req.body
    Exercise.update({ move, description }, { where: { id: req.params.id } })
      .then(() => {
        req.flash('success_msg', '動作項目修改成功。')
        res.redirect('/admin/courses/exercises')
      })
  },
  deleteExercises: (req, res) => {
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
  postEquipments: (req, res) => {
    const { item, description } = req.body
    Equipment.create({ item, description })
      .then(() => {
        req.flash('success_msg', '器材新增成功。')
        res.redirect('/admin/courses/equipments')
      })
  },
  putEquipments: (req, res) => {
    const { item, description } = req.body
    Equipment.update({ item, description }, { where: { id: req.params.id } })
      .then(() => {
        req.flash('success_msg', '器材更新成功。')
        res.redirect('/admin/courses/equipments')
      })
  },
  deleteEquipments: (req, res) => {
    Equipment.destroy({ where: { id: req.params.id } })
      .then(() => {
        req.flash('success_msg', '器材刪除成功。')
        res.redirect('/admin/courses/equipments')
      })
  },

  // 動作、器材、次數組合
  getTrainings: async (req, res) => {
    const trainings = await Training.findAll({ raw: true, nest: true, include: [Exercise, Equipment] })
    res.render('admin/courses', { trainings })
  },

  // 訓練日的菜單
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