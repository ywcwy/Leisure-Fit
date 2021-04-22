const db = require('../models')
const { Leisurefit, Category, User, Like, Record, Trainingday, Training, Equipment, Exercise, Workout } = db
const moment = require('moment')
const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENT_ID)

const profileController = {
  getProfile: async (req, res) => {
    let records = await Record.findAll({ where: { UserId: Number(req.user.id) }, raw: true, nest: true, include: [User] })
    records = records.map(r => {
      return {
        ...r,
        date: moment(r.date).format('YYYY-MM-DD')
      }
    })
    res.render('profile', { records })
  },
  getRecords: async (req, res) => {
    let records = await Record.findAll({ where: { UserId: Number(req.user.id) }, raw: true, nest: true, include: [User, { model: Trainingday, include: [Category] }] })
    records = records.map(r => {
      return {
        ...r,
        date: moment(r.Trainingday.date).format('YYYY-MM-DD'),
        category: r.Trainingday.Category.name,
        duration: r.Trainingday.duration
      }
    })
    res.render('records', { records })
  },
  getRecord: async (req, res) => {
    let record = await Record.findByPk(req.params.id, {
      raw: true, nest: true,
      include: [User, { model: Trainingday, include: [Category, { model: Training, as: 'TrainingList', include: [Exercise, Equipment] }] }]
    })
    const workout = await Workout.findOne({ where: { TrainingdayId: record.TrainingdayId }, raw: true })
    record = {
      ...record,
      date: moment(record.Trainingday.date).format('YYYY-MM-DD'),
      category: record.Trainingday.Category.name,
      duration: record.Trainingday.duration,
      exercise: record.Trainingday.TrainingList.Exercise.move,
      exerciseDescription: record.Trainingday.TrainingList.Exercise.description,
      equipment: record.Trainingday.TrainingList.Equipment.item,
      equipmentDescription: record.Trainingday.TrainingList.Equipment.description,
      repetitions: workout.repetitions,
      sets: workout.sets
    }
    res.render('record', { record })
  },
  getLikedLeisurefits: async (req, res) => {
    let likes = await Like.findAll({ where: { UserId: Number(req.user.id) }, raw: true, nest: true, include: [User, { model: Leisurefit, include: Category }] })
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