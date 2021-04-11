const db = require('../models')
const { Leisurefit, Category, User, Like } = db

const profileController = {
  getProfile: (req, res) => {
    res.render('profile')
  },
  getLikedLeisurefits: async (req, res) => {
    const likes = await Like.findAll({ where: { UserId: req.user.id }, raw: true, nest: true, include: [User, { model: Leisurefit, include: Category }] })
    res.render('likedLeisurefits', { likes })
  },
  removeLikedLeisurefits: async (req, res) => {
    const like = await Like.findOne({ UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) })
    like.destroy()
      .then(() => res.redirect('/user/likedLeisurefits'))
  }
}

module.exports = profileController