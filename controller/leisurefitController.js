const db = require('../models')
const { Leisurefit, Category, User } = db

const leisurefitController = {
  getLeisurefits: async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    const itemInPage = 9 // 每頁九筆資料
    let offset = 0
    const page = Number(req.query.page) || 1  // 每次使用者點入後會看到的第一頁
    const whereQuery = {}
    if (req.query.page) {
      offset = (req.query.page - 1) * itemInPage
    }
    let categoryId = ''
    let categoryName = '' // 功能表選單上要顯示的 category 名稱
    if (req.query.categoryId && req.query.categoryId !== 'all') {
      categoryId = Number(req.query.categoryId)
      whereQuery.categoryId = categoryId
      const category = await Category.findByPk(categoryId)
      categoryName = category.name
    }

    let leisurefits = await Leisurefit.findAndCountAll({
      where: whereQuery, offset, limit: itemInPage, raw: true, nest: true,
      include: [Category, { model: User, as: 'LikedUsers' }]
    })
    const pages = Math.ceil(leisurefits.count / itemInPage) // 最大頁數
    const totalPage = Array.from({ length: pages }).map((item, index) => index + 1) // 將每個頁數帶入分頁表顯示
    const prev = page - 1 < 1 ? 1 : page - 1
    const next = page + 1 > pages ? pages : page + 1
    leisurefits = leisurefits.rows.map(l => {
      return {
        ...l,
        description: l.description.substring(0, 50) + '...',
        isLiked: req.user ? req.user.LikedLeisurefits.map(d => d.id).includes(l.id) : false
      }
    })
    return res.render('index', { leisurefits, categories, categoryId, categoryName, totalPage, prev, next, page })
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

