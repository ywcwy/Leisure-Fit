const db = require('../models')
const { Like } = db

const likeController = {
  addLike: async (req, res) => {
    try {
      await Like.create({ UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) })
    } catch (error) {
      req.flash('warning_msg', 'add like successfully')
      return res.redirect('back')
    }
    return res.redirect('back')
  },
  removeLike: async (req, res) => {
    try {
      await Like.destroy({ where: { UserId: Number(req.user.id), LeisurefitId: Number(req.params.id) } })
    } catch (error) {
      req.flash('warning_msg', 'remove like successfully')
      return res.redirect('back')
    }
    return res.redirect('back')
  }
}

module.exports = likeController