const db = require('../models')
const { Leisurefit, Category } = db

const categoryController = {
  getCategories: async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    res.render('admin/courses', { categories })
  },
  postCategory: async (req, res) => {
    Category.create({ name: req.body.name, day: req.body.day })
      .then(() => {
        req.flash('success_msg', '課程新增成功')
        res.redirect('/admin/categories')
      })
  }
}

module.exports = categoryController