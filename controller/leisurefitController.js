const db = require('../models')
const { Leisurefit, Category, User } = db

const leisurefitController = {
  getIndex: (req, res) => {
    const cover = '/images/Leisurefit-cover.png'
    return res.render('index', { cover, css: 'index.css' })
  },
  getLeisurefits: async (req, res) => {
    const cover = '/images/01.jpg'
    const [categories, category] = await Promise.all(
      [Category.findAll({ raw: true }),
      helper.getFilter(req.query.categoryId)    // 篩選
      ])
    const { categoryId, categoryName, whereQuery } = category
    const dataWithPagination = await helper.getPagination(whereQuery, req.query.page)
    const data = await helper.getLeisurefits(dataWithPagination, req.user)

    return res.render('leisurefits', {
      cover, categories, categoryId, categoryName, data, css: 'leisurefits.css'
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

const helper = {
  getFilter: async (category) => {
    let categoryId = category || 'all'
    let whereQuery = {}
    let categoryName = '' // 功能表選單上要顯示的 category 名稱
    if (category && category !== 'all') {
      whereQuery.categoryId = Number(category)
      const thisCategory = await Category.findByPk(category)
      categoryName = thisCategory.name
    }
    return { whereQuery, categoryId, categoryName }
  },
  getPagination: async (whereQuery, page) => {
    const itemInPage = 9 // 每頁九筆資料
    let offset = 0
    const currentPage = Number(page) || 1  // 每次使用者點入後會看到的第一頁
    if (page) { offset = (page - 1) * itemInPage }
    const leisurefits = await Leisurefit.findAndCountAll({
      where: whereQuery, offset, limit: itemInPage, include: [Category, { model: User, as: 'LikedUsers' }], raw: true, nest: true
    })
    const maxPage = Math.ceil(leisurefits.count / itemInPage) // 最大頁數
    const totalPage = Array.from({ length: maxPage }).map((item, index) => index + 1) // 將每個頁數帶入分頁表顯示
    const prev = currentPage - 1 < 1 ? 1 : currentPage - 1
    const next = currentPage + 1 > maxPage ? maxPage : currentPage + 1
    return { totalPage, prev, next, currentPage, maxPage, leisurefits }
  },
  getLeisurefits: async (data, user) => {
    data.leisurefits = data.leisurefits.rows.map(l => {
      return {
        ...l,
        description: l.description.substring(0, 50) + '...',
        isLiked: user ? user.LikedLeisurefits.map(d => d.id).includes(l.id) : false
      }
    })
    return data
  }
}
module.exports = leisurefitController

