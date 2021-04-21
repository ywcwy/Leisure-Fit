const db = require('../models')
const { Leisurefit, Category } = db
const moment = require('moment')
const imgur = require('imgur')
imgur.setClientId(process.env.IMGUR_CLIENT_ID)

const adminController = {
  getLeisurefits: async (req, res) => {
    let leisurefits = await Leisurefit.findAll({ raw: true, nest: true, include: [Category] })
    leisurefits = leisurefits.map(l => {
      return {
        ...l,
        createdAt: moment(l.createdAt).format('YYYY-MM-DD')
      }
    })
    res.render('admin/leisurefits', { leisurefits })
  },
  createLeisurefit: async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true })
    res.render('admin/leisurefitCreate', { categories, leisurefit })
  },
  postLeisurefit: async (req, res) => {
    let { categoryId, name, description } = req.body
    // console.log(categoryId)
    // const classCategory = await Category.findOne({ name: category })
    let img = ''
    if (req.file) { img = await imgur.uploadFile(req.file.path) }
    // console.log('********')
    // console.log(description)
    // description = description.replace('\n', '<br />')
    // console.log('^^^^^^^^^^^')
    console.log(description)
    Leisurefit.create({ name, CategoryId: Number(categoryId), description, image: req.file ? img.link : '' })
      .then(() => {
        req.flash('success_msg', '貼文新增成功')
        res.redirect(`/admin/leisurefits`)
      })
  },
  getLeisurefit: async (req, res) => {
    const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true, nest: true, include: [Category] })
    console.log(leisurefit)
    leisurefit.createdAt = moment(leisurefit.createdAt).format('YYYY-MM-DD')
    leisurefit.description = leisurefit.description.replace(/\r?\n/g, '<br />')
    // console.log(leisurefit)
    res.render('admin/leisurefit', { leisurefit })
  },
  putLeisurefit: async (req, res) => {
    const leisurefit = await Leisurefit.findByPk(req.params.id, { include: [Category] })
    let { categoryId, name, description } = req.body
    // console.log('********')
    // console.log(description)
    // description = description.replace(/\n/g, '<br />')
    // console.log('^^^^^^^^^^^')
    // console.log(description)
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