const db = require('../models')
const { Leisurefit, Category, User, Like, Record, Trainingday, Training, Equipment, Exercise, Workout, Enroll, WaitingList } = db
const bcrypt = require('bcryptjs')
const { formatDate, formatTime } = require('../config/formatDate&Time')


const profileController = {
  getProfile: async (req, res) => {
    const me = await User.findByPk(req.user.id, { raw: true })
    return res.render('profile', { name: me.name, email: me.email })
  },
  getProfileEdit: async (req, res) => {
    const me = await User.findByPk(req.user.id, { raw: true })
    return res.render('profileEdit', { name: me.name, email: me.email })
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

    const myProfile = await User.findOne({ where: { id: req.user.id } })
    try {
      User.update({ name, email, password: password ? bcrypt.hashSync(password, bcrypt.genSaltSync(10)) : myProfile.password }, { where: { id: req.user.id } })
    } catch (error) {
      req.flash('warning_msg', '帳號更新失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '帳號更新成功。')
    return res.redirect('/user/profile')
  },
  getRecords: async (req, res) => {
    // 自己目前的報名狀況
    const enrollTraining = await Trainingday.findAll({ where: { enroll: 1 }, order: [['date', 'ASC']], include: [Category], raw: true, nest: true })
    const enrollList = []
    const waitingList = []
    const waitToEnroll = []
    await Promise.all(enrollTraining.map(async (e) => {
      const UserId = req.user.id
      const TrainingdayId = e.id
      const [alreadyEnroll, enrollCount, alreadyOnWaitingList, waitingCount] = await Promise.all([
        Enroll.findOne({ where: { UserId, TrainingdayId } }),
        Enroll.count({ where: { TrainingdayId } }),
        WaitingList.findOne({ where: { UserId, TrainingdayId } }),
        WaitingList.count({ where: { TrainingdayId } })
      ])
      if (alreadyEnroll) {
        enrollList.push({
          ...e,
          date: formatDate(e.date),
          time: formatTime(e.time)
        })
      } else if (alreadyOnWaitingList) {
        waitingList.push({
          ...e,
          date: formatDate(e.date),
          time: formatTime(e.time),
          myEnroll: alreadyOnWaitingList ? 1 : 0
        })
      } else if (!alreadyEnroll && !alreadyOnWaitingList) {
        waitToEnroll.push({
          ...e,
          date: formatDate(e.date),
          time: formatTime(e.time),
          available: (enrollCount >= e.limitNumber && waitingCount >= e.limitNumber) ? 0 : 1  // 如果正取備取都已額滿，則為0
        })
      }
    }))
    // 自己已上過的課程
    let records = await Record.findAll({
      where: { UserId: req.user.id }, attributes: ['id'], include: [User, { model: Trainingday, include: [Category] }], raw: true, nest: true
    })
    records = records.map(r => {
      return {
        ...r,
        id: r.id,
        date: formatDate(r.Trainingday.date),
        category: r.Trainingday.Category.name,
        time: formatTime(r.Trainingday.time)
      }
    })
    return res.render('records', { records, enrollList, waitingList, waitToEnroll })
  },
  getRecord: async (req, res) => {
    const record = await Record.findOne({
      where: { id: req.params.id }, include: [{ model: Trainingday, include: [Category], raw: true, nest: true }]
    })
    const { id, date, time } = record.Trainingday
    const workouts = await Workout.findAll({
      where: { TrainingdayId: id }, include: [{ model: Training, include: [Exercise, Equipment] }], raw: true, nest: true
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
      training, time: formatTime(time), date: formatTime(date), category: record.Trainingday.Category.name,
    })
  },
  getLikedLeisurefits: async (req, res) => {
    let likes = await Like.findAll({
      where: { UserId: req.user.id }, include: [User, { model: Leisurefit, include: Category }], raw: true, nest: true
    })
    likes = likes.map(l => {
      return {
        ...l,
        description: l.Leisurefit.description.substring(0, 50) + '...'
      }
    })
    return res.render('likedLeisurefits', { likes })
  }
}

module.exports = profileController