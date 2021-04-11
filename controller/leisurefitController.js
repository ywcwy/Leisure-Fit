const db = require('../models')
const { Leisurefit, Category, User } = db

const leisurefitController = {
  getLeisurefits: async (req, res) => {
    const categoryId = req.query.categoryId
    const categories = await Category.findAll({ raw: true })
    let leisurefits = await Leisurefit.findAll({ raw: true, nest: true, include: [Category, { model: User, as: 'LikedUsers' }] })
    let category = ''
    if (categoryId && categoryId !== 'all') {
      category = await Category.findByPk(Number(categoryId))
      leisurefits = await Leisurefit.findAll({
        where: { CategoryId: Number(categoryId) }, raw: true, nest: true, include: [Category, { model: User, as: 'LikedUsers' }]
      })
    }
    leisurefits = leisurefits.map(l => {
      return {
        ...l,
        description: l.description.substring(0, 50) + '...',
        isLiked: req.user ? req.user.LikedLeisurefits.map(d => d.id).includes(l.id) : false
      }
    })
    return res.render('index', { leisurefits, categories, categoryName: category.name })
  },
  googleMap: (req, res) => {
    return res.render('googleMap', { css: 'googleMap.css', javascript: 'googleMap.js' })
  },
  getLeisurefit: async (req, res) => {
    const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    return res.render('leisurefit', { leisurefit })
  }
}

module.exports = leisurefitController

