const db = require('../models')
const { Leisurefit, Category, User } = db

const leisurefitController = {
  getIndex: (req, res) => {
    const cover = '/images/Leisurefit-cover.png'
    return res.render('index', { cover, css: 'index.css' })
  },
  getLeisurefits: async (req, res) => {
    const cover = '/images/01.jpg'
    const itemInPage = 9 // 每頁九筆資料
    let offset = 0
    const currentPage = Number(req.query.page) || 1  // 每次使用者點入後會看到的第一頁
    const whereQuery = {}
    if (req.query.page) {
      offset = (req.query.page - 1) * itemInPage
    }
    let categoryId = 'all'
    let categoryName = '' // 功能表選單上要顯示的 category 名稱
    if (req.query.categoryId && req.query.categoryId !== 'all') {
      categoryId = Number(req.query.categoryId)
      whereQuery.categoryId = categoryId
      const category = await Category.findByPk(categoryId)
      categoryName = category.name
    }

    let [leisurefits, categories] = await Promise.all([Leisurefit.findAndCountAll({
      where: whereQuery, offset, limit: itemInPage, raw: true, nest: true,
      include: [Category, { model: User, as: 'LikedUsers' }]
    }), Category.findAll({ raw: true })])
    const maxPage = Math.ceil(leisurefits.count / itemInPage) // 最大頁數
    const totalPage = Array.from({ length: maxPage }).map((item, index) => index + 1) // 將每個頁數帶入分頁表顯示
    const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
    const next = currentPage + 1 > maxPage ? maxPage : currentPage + 1
    leisurefits = leisurefits.rows.map(l => {
      return {
        ...l,
        description: l.description.substring(0, 50) + '...',
        isLiked: req.user ? req.user.LikedLeisurefits.map(d => d.id).includes(l.id) : false
      }
    })
    return res.render('leisurefits', {
      cover, leisurefits, categories, categoryId, categoryName,
      totalPage, prev, next, currentPage, maxPage, css: 'leisurefits.css'
    })
  },
  googleMap: (req, res) => { return res.render('googleMap', { css: 'googleMap.css', javascript: 'googleMap.js', cover: '/images/02.jpg' }) },
  getLeisurefit: async (req, res) => {
    const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    return res.render('leisurefit', { leisurefit })
  },
  getCalendar: (req, res) => { return res.render('calendar', { css: 'calendar.css', cover: '/images/04.jpg' }) },
  getContactUs: (req, res) => { return res.render('contactUs', { cover: '/images/05.jpg' }) }
}

module.exports = leisurefitController

