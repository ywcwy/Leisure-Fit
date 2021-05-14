const db = require('../models')
const { Category } = db

const categoryController = {
  getCategories: async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    let category = {}
    if (req.params.id) {
      category = await Category.findByPk(req.params.id, { raw: true })
    }
    return res.render('admin/categories', { categories, category })
  },
  postCategory: async (req, res) => {
    try {
      await Category.create({ name: req.body.name, day: req.body.day, day_CH: req.body.chinese })
    } catch (error) {
      req.flash('warning_msg', '課程新增失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '課程新增成功')
    return res.redirect('back')
  },
  editCategory: async (req, res) => {
    try {
      await Category.update({ name: req.body.name, day: req.body.day }, { where: { id: req.params.id } })
    } catch (error) {
      req.flash('warning_msg', '課程編輯失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '課程更新成功')
    return res.redirect('/admin/categories')
  },
  deleteCategory: async (req, res) => {
    try {
      await Category.destroy({ where: { id: req.params.id } })
    } catch (error) {
      req.flash('warning_msg', '課程刪除失敗')
      return res.redirect('back')
    }
    req.flash('success_msg', '課程刪除成功')
    return res.redirect('back')
  }
}

module.exports = categoryController