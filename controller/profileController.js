const db = require('../models')
const { Leisurefit, Category, User, Like, Record } = db

const profileController = {
  getProfile: async (req, res) => {
    const records = await Record.findAll({ where: { UserId: Number(req.user.id) }, raw: true, nest: true, include: [User] })
    res.render('profile', { records })
  },
  createRecord: async (req, res) => {
    const categories = await Category.findAll()
    res.render('recordCreate', { categories })
  },
  getRecords: async (req, res) => {
    const records = await Record.findAll({ where: { UserId: Number(req.user.id) }, raw: true, nest: true, include: [User] })
    res.render('record', { records })
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