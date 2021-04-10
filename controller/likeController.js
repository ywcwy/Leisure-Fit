const db = require('../models')
const { User, Like } = db

const likeController = {
  addLike: (req, res) => {
    Like.create({ UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) })
      .then(() => res.redirect('/'))
  },
  removeLike: async (req, res) => {
    const like = await Like.findOne({ UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) })
    like.destroy()
      .then(() => res.redirect('/'))
  }
}

module.exports = likeController