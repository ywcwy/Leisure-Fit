const db = require('../models')
const { Leisurefit, Category, User, Like, Record, Trainingday, Training, Equipment, Exercise, Workout, Enroll, WaitingList } = db
const bcrypt = require('bcryptjs')
const moment = require('moment')


const profileController = {
  getProfile: async (req, res) => {
    try {
      const me = await User.findByPk(req.user.id, { raw: true })
      return res.render('profile', { name: me.name, email: me.email })
    } catch (error) { console.log(error) }
  },
  getProfileEdit: async (req, res) => {
    try {
      const me = await User.findByPk(req.user.id, { raw: true })
      return res.render('profileEdit', { name: me.name, email: me.email })
    } catch (error) { console.log(error) }
  },
  editProfile: async (req, res) => {
    try {
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
      await User.update({ name, email, password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : oldPassword }, { where: { id: req.user.id } })
      req.flash('success_msg', '帳號更新成功。')
      return res.redirect('/user/profile')
    } catch (error) { console.log(error) }
  },
  getRecords: async (req, res) => {
    try {
      // 自己目前的報名狀況
      const enrollTraining = await Trainingday.findAll({ where: { enroll: 1 }, order: [['date', 'ASC']], raw: true, nest: true, include: [Category] })
      const enrollList = []
      const waitingList = []
      const waitToEnroll = []
      await Promise.all(enrollTraining.map(async (e) => {
        const alreadyEnroll = await Enroll.findOne({ where: { UserId: req.user.id, TrainingdayId: e.id } })
        if (alreadyEnroll) {
          enrollList.push({
            ...e,
            date: moment(e.date).format('YYYY-MM-DD'),
            time: moment(e.time, moment.HTML5_FMT.TIME).format("HH:mm")
          })
        }

        const alreadyOnWaitingList = await WaitingList.findOne({ where: { UserId: req.user.id, TrainingdayId: e.id } })
        if (alreadyOnWaitingList) {
          waitingList.push({
            ...e,
            date: moment(e.date).format('YYYY-MM-DD'),
            time: moment(e.time, moment.HTML5_FMT.TIME).format("HH:mm"),
            myEnroll: alreadyOnWaitingList ? 1 : 0
          })
        }

        if (!alreadyEnroll && !alreadyOnWaitingList) {
          waitToEnroll.push({
            ...e,
            date: moment(e.date).format('YYYY-MM-DD'),
            time: moment(e.time, moment.HTML5_FMT.TIME).format("HH:mm")
          })
        }
      }))

      // 自己已上過的課程
      let records = await Record.findAll({
        where: { UserId: Number(req.user.id) }, attributes: ['id'], raw: true, nest: true,
        include: [User, { model: Trainingday, include: [Category] }]
      })
      records = records.map(r => {
        return {
          ...r,
          id: r.id,
          date: moment(r.Trainingday.date).format('YYYY-MM-DD'),
          category: r.Trainingday.Category.name,
          time: moment(r.Trainingday.time, moment.HTML5_FMT.TIME).format("HH:mm")
        }
      })
      return res.render('records', { records, enrollList, waitingList, waitToEnroll })
    } catch (error) { console.log(error) }
  },
  getRecord: async (req, res) => {
    try {
      const record = await Record.findOne({
        where: { id: req.params.id }, raw: true, nest: true, include: [{ model: Trainingday, include: [Category] }]
      })
      const { id, date, time } = record.Trainingday
      const workouts = await Workout.findAll({
        where: { TrainingdayId: id }, raw: true, nest: true,
        include: [{ model: Training, include: [Exercise, Equipment] }]
      })
      const training = workouts.map(w => {
        return {
          exercise: w.Training.Exercise.move,
          exerciseDescription: w.Training.Exercise.description,
          equipment: w.Training.Equipment.item,
          equipmentDescription: w.Training.Equipment.description,
          repetitions: w.repetitions,
          sets: w.sets
        }
      })
      return res.render('record', {
        training, time: moment(time, moment.HTML5_FMT.TIME).format("HH:mm"),
        category: record.Trainingday.Category.name,
        date: moment(date).format('YYYY-MM-DD'),
      })
    } catch (error) { console.log(error) }
  },
  getLikedLeisurefits: async (req, res) => {
    try {
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
      return res.render('likedLeisurefits', { likes })
    } catch (error) { console.log(error) }
  },
  removeLikedLeisurefits: async (req, res) => {
    try {
      await Like.destroy({ where: { UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) } })
      return res.redirect('/user/likedLeisurefits')
    } catch (error) { console.log(error) }
  }
}

module.exports = profileController