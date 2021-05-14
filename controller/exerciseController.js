const db = require('../models')
const { Exercise } = db

const exerciseController = {
  getExercises: async (req, res) => {
    const exercises = await Exercise.findAll({ raw: true })
    let exercise = {}
    if (req.params.id) { exercise = await Exercise.findByPk(req.params.id, { raw: true }) }
    return res.render('admin/courses', { exercises, exercise })
  },
  postExercise: async (req, res) => {
    const { move, description } = req.body
    try {
      await Exercise.create({ move, description })
    } catch (error) {
      req.flash('warning_msg', '課程日新增失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '動作項目新增成功。')
    return res.redirect('back')
  },
  putExercise: async (req, res) => {
    const { move, description } = req.body
    try {
      await Exercise.update({ move, description }, { where: { id: req.params.id } })
      req.flash('success_msg', '動作項目修改成功。')
    } catch (error) {
      req.flash('warning_msg', '動作項目修改失敗')
      return res.redirect('back')
    }
    return res.redirect('/admin/courses/exercises')
  },
  deleteExercise: async (req, res) => {
    try {
      await Exercise.destroy({ where: { id: req.params.id } })
    } catch (error) {
      req.flash('warning_msg', '動作項目刪除失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '動作項目刪除成功。')
    return res.redirect('back')
  }
}

module.exports = exerciseController
