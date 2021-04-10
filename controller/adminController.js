const db = require('../models')
const { Leisurefit, Category } = db
const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENT_ID)

const adminController = {
  getLeisurefits: (req, res) => {
    Leisurefit.findAll({ raw: true, nest: true, include: [Category] })
      .then(leisurefits => res.render('admin/leisurefits', { leisurefits }))
  },
  createLeisurefit: async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true })
    res.render('admin/create', { categories, leisurefit })
  },
  postLeisurefit: async (req, res) => {
    const { category, name, description } = req.body
    const classCategory = await Category.findOne({ name: category })
    let img = ''
    if (req.file) { img = await imgur.uploadFile(req.file.path) }
    Leisurefit.create({ name, CategoryId: classCategory.id, description: description.trim(), image: req.file ? img.link : '' })
      .then(() => {
        req.flash('success_msg', '貼文新增成功')
        res.redirect(`/admin/leisurefits`)
      })
  },
  getLeisurefit: async (req, res) => {
    const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    res.render('admin/leisurefit', { leisurefit })
  },
  putLeisurefit: async (req, res) => {
    const leisurefit = await Leisurefit.findByPk(req.params.id, { include: [Category] })
    const { categoryId, name, description } = req.body
    let img = leisurefit.image
    if (req.file) { img = await imgur.uploadFile(req.file.path) }
    leisurefit.update({ name, CategoryId: Number(categoryId), description, image: req.file ? img.link : leisurefit.image })
      .then(leisurefit => {
        req.flash('success_msg', '貼文編輯成功')
        res.redirect(`/admin/leisurefits/${req.params.id}`)
      })
  },
  deleteLeisurefit: async (req, res) => {
    const leisurefit = await Leisurefit.findByPk(req.params.id)
    leisurefit.destroy()
      .then(() => {
        req.flash('success_msg', '貼文刪除成功')
        res.redirect('/admin/leisurefits')
      })
  }
}

module.exports = adminController