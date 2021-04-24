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
    let record = await Record.findByPk(req.params.id, { raw: true, nest: true, include: [{ model: Trainingday, include: [Category] }] })
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
    let likes = await Like.findAll({ where: { UserId: Number(req.user.id) }, raw: true, nest: true, include: [User, { model: Leisurefit, include: Category }] })
    console.log(likes)
    likes = likes.map(l => {
      return {
        ...l,
        description: l.Leisurefit.description
        // .substring(0, 50) + '...'
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