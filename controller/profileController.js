const db = require('../models')
const { Leisurefit, Category, User, Like, Record, Trainingday, Training, Equipment, Exercise, Workout } = db
const bcrypt = require('bcryptjs')
const moment = require('moment')


const profileController = {
  getProfile: async (req, res) => {
    const me = await User.findByPk(req.user.id, { raw: true })
    res.render('profile', { name: me.name, email: me.email })
  },
  getProfileEdit: async (req, res) => {
    const me = await User.findByPk(req.user.id, { raw: true })
    res.render('profileEdit', { name: me.name, email: me.email })
  },
  editProfile: async (req, res) => {
    const { name, email, password, passwordConfirm } = req.body
    if (!name || !email) {
      req.flash('warning_msg', 'name 及 email 欄位為必填。')
      return res.render('profileEdit', { name, email, password, passwordConfirm })
    }

    const user = await User.findOne({ where: { email: email } })
    if (user) {
      if (user.id !== req.user.id) {
        const error = [{ message: '此email已註冊過。' }]
        return res.render('profileEdit', { error, name, email })
      }
    }

    if (password || passwordConfirm) {
      if (!password || !passwordConfirm) {
        req.flash('warning_msg', '如需更換密碼，password 及 passwordConfirm 欄位皆為必填。')
        return res.render('profileEdit', { name, email, password, passwordConfirm })
      }
      if (password !== passwordConfirm) {
        const error = [{ message: '密碼與確認密碼不相符。' }]
        return res.render('profileEdit', { error, name, email })
      }
    }

    const myProfile = await User.findOne({ where: { id: req.user.id }, raw: true })
    const oldPassword = myProfile.password
    User.update({ name, email, password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : oldPassword }, { where: { id: req.user.id } })
      .then(() => {
        req.flash('success_msg', '帳號更新成功。')
        return res.redirect('/user/profile')
      })
  },
  getRecords: async (req, res) => {
    let records = await Record.findAll({ where: { UserId: Number(req.user.id) }, attributes: ['id'], raw: true, nest: true, include: [User, { model: Trainingday, include: [Category] }] })
    records = records.map(r => {
      return {
        ...r,
        id: r.id,
        date: moment(r.Trainingday.date).format('YYYY-MM-DD'),
        category: r.Trainingday.Category.name,
        duration: r.Trainingday.duration
      }
    })
    res.render('records', { records })
  },
  getRecord: async (req, res) => {
    let record = await Record.findOne({ where: { id: req.params.id }, raw: true, nest: true, include: [{ model: Trainingday, include: [Category] }] })
    console.log(record)
    let { id, date, duration } = record.Trainingday
    date = moment(date).format('YYYY-MM-DD')
    category = record.Trainingday.Category.name

    const workouts = await Workout.findAll({
      where: { TrainingdayId: id }, raw: true, nest: true,
      include: [{ model: Training, include: [Exercise, Equipment] }]
    })
    const training = await Promise.all(workouts.map(w => {
      return {
        exercise: w.Training.Exercise.move,
        exerciseDescription: w.Training.Exercise.description,
        equipment: w.Training.Equipment.item,
        equipmentDescription: w.Training.Equipment.description,
        repetitions: w.repetitions,
        sets: w.sets
      }
    }))
    res.render('record', { training, date, duration, category })
  },
  getLikedLeisurefits: async (req, res) => {
    let likes = await Like.findAll({
      where: { UserId: Number(req.user.id) }, raw: true, nest: true,
      include: [User, { model: Leisurefit, include: Category }]
    })
    likes = likes.map(l => {
      return {
        ...l,
        description: l.Leisurefit.description.substring(0, 50) + '...'
      }
    })
    res.render('likedLeisurefits', { likes })
  },
  removeLikedLeisurefits: async (req, res) => {
    const like = await Like.findOne({ UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) })
    like.destroy()
      .then(() => res.redirect('/user/likedLeisurefits'))
  }
}

module.exports = profileController