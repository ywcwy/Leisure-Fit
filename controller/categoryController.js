const db = require('../models')
const { Category } = db

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true })
      let category = {}
      if (req.params.id) {
        category = await Category.findByPk(req.params.id, { raw: true })
      }
      return res.render('admin/categories', { categories, category })
    } catch (error) { console.log(error) }
  },
  postCategory: async (req, res) => {
    try {
      await Category.create({ name: req.body.name, day: req.body.day })
      req.flash('success_msg', '課程新增成功')
      return res.redirect('/admin/categories')
    } catch (error) { console.log(error) }
  },
  editCategory: async (req, res) => {
    try {
      await Category.update({ name: req.body.name, day: req.body.day }, { where: { id: req.params.id } })
      req.flash('success_msg', '課程更新成功')
      return res.redirect('/admin/categories')
    } catch (error) { console.log(error) }
  },
  deleteCategory: async (req, res) => {
    try {
      await Category.destroy({ where: { id: req.params.id } })
      req.flash('success_msg', '課程刪除成功')
      return res.redirect('/admin/categories')
    } catch (error) { console.log(error) }
  }
}

module.exports = categoryController