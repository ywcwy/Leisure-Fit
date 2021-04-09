const db = require('../models')
const { Leisurefit, Category } = db

const leisurefitController = {
  getLeisurefits: async (req, res) => {
    const categoryId = req.query.categoryId
    const categories = await Category.findAll({ raw: true })
    let leisurefits = []
    let category = ''
    if (categoryId && categoryId !== 'all') {
      category = await Category.findByPk(Number(categoryId))
      leisurefits = await Leisurefit.findAll({ where: { CategoryId: Number(categoryId) }, raw: true, nest: true, include: [Category] })
    } else {
      leisurefits = await Leisurefit.findAll({ raw: true, nest: true, include: [Category] })
      leisurefits = leisurefits.map(l => {
        return {
          ...l,
          description: l.description.substring(0, 50) + '...'
        }
      })
    }
    return res.render('index', { leisurefits, categories, categoryName: category.name })
  },
  googleMap: (req, res) => {
    return res.render('googleMap')
  },
  getLeisurefit: async (req, res) => {
    const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    return res.render('leisurefit', { leisurefit })
  }
}

module.exports = leisurefitController

