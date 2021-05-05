const db = require('../models')
const { Like } = db

const likeController = {
  addLike: async (req, res) => {
    try {
      await Like.create({ UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) })
      return res.redirect('/')
    } catch (error) { console.log(error) }

  },
  removeLike: async (req, res) => {
    try {
      await Like.destroy({ where: { UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) } })
      return res.redirect('/')
    } catch (error) { console.log(error) }

  }
}

module.exports = likeController