const db = require('../models')
const { Like } = db

const likeController = {
  addLike: async (req, res) => {
    await Like.create({ UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) })
    return res.redirect('back')
  },
  removeLike: async (req, res) => {
    await Like.destroy({ where: { UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) } })
    return res.redirect('back')
  }
}

module.exports = likeController