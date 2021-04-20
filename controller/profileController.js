const db = require('../models')
const { Leisurefit, Category, User, Like, Record } = db
const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENT_ID)

const profileController = {
  getProfile: async (req, res) => {
    const records = await Record.findAll({ where: { UserId: Number(req.user.id) }, raw: true, nest: true, include: [User] })
    res.render('profile', { records })
  },
  createRecord: async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    let record = {}
    if (req.params.id) {
      record = await Record.findByPk(req.params.id, { raw: true, nest: true, include: [User, Category] })
    }
    res.render('recordCreate', { categories, record })
  },
  postRecord: async (req, res) => {
    const { categoryId, date, workout, times, note } = req.body
    let img = ''
    if (req.file) { img = await imgur.uploadFile(req.file.path) }
    let record = {}
    if (req.params.id) {
      record = await Record.findByPk(req.params.id, { raw: true, nest: true, include: [User, Category] })
    }
    Record.create({ UserId: Number(req.user.id), CategoryId: Number(categoryId), date, workout, times, image: req.file ? img.link : null, note: note ? note.trim() : null })
      .then(() => res.redirect('/user/training'))
  },
  getRecords: async (req, res) => {
    const records = await Record.findAll({ where: { UserId: Number(req.user.id) }, raw: true, nest: true, include: [User] })
    res.render('records', { records })
  },
  getRecord: async (req, res) => {
    const record = await Record.findByPk(req.params.id, { raw: true, nest: true, include: [User, Category] })
    res.render('record', { record })
  },
  putRecord: async (req, res) => {
    const { categoryId, date, workout, times, note } = req.body
    const record = await Record.findByPk(req.params.id)
    console.log(record.image)
    let img = ''
    if (req.file) { img = await imgur.uploadFile(req.file.path) }
    console.log(req.file)
    record.update({ CategoryId: Number(categoryId), date, workout, times, image: req.file ? img.link : record.image, note: note ? note.trim() : '' })
      .then(() => res.redirect(`/user/training/records/${req.params.id}`))
  },
  getLikedLeisurefits: async (req, res) => {
    const likes = await Like.findAll({ where: { UserId: Number(req.user.id) }, raw: true, nest: true, include: [User, { model: Leisurefit, include: Category }] })
    res.render('likedLeisurefits', { likes })
  },
  removeLikedLeisurefits: async (req, res) => {
    const like = await Like.findOne({ UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) })
    like.destroy()
      .then(() => res.redirect('/user/likedLeisurefits'))
  }
}

module.exports = profileController