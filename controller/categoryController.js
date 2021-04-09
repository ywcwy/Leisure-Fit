const db = require('../models')
const { Leisurefit, Category } = db

const categoryController = {
  getCategories: async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    res.render('admin/courses', { categories })
  }
}

module.exports = categoryController