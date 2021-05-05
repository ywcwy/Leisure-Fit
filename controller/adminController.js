const db = require('../models')
const { Leisurefit, Category, Like } = db
const moment = require('moment')
const { ImgurClient } = require('imgur')
const client = new ImgurClient({ clientId: process.env.IMGUR_CLIENT_ID })
client.on('uploadProgress', (progress) => console.log(progress))

const adminController = {
  getLeisurefits: async (req, res) => {
    let leisurefits = await Leisurefit.findAll({ raw: true, nest: true, include: [Category] })
    leisurefits = await Promise.all(leisurefits.map(async (l) => {
      const { count } = await Like.findAndCountAll({ where: { LeisurefitId: l.id } })
      return {
        ...l,
        createdAt: moment(l.createdAt).format('YYYY-MM-DD'),
        likes: count
      }
    }))
    res.render('admin/leisurefits', { leisurefits })
  },
  createLeisurefit: async (req, res) => {
    const categories = await Category.findAll({ raw: true })
    const leisurefit = await Leisurefit.findByPk(req.params.id, { raw: true })
    res.render('admin/leisurefitCreate', { categories, leisurefit })
  },
  postLeisurefit: async (req, res) => {
    try {
      let { categoryId, name, description } = req.body
      // console.log(categoryId)
      // const classCategory = await Category.findOne({ name: category })
      let img = ''
      if (req.file) { img = await client.upload(req.file.path) }
      // console.log('********')
      // console.log(description)
      // description = description.replace('\n', '<br />')
      Leisurefit.create({ name, CategoryId: Number(categoryId), description, image: req.file ? img.data.link : '' })
        .then(() => {
          req.flash('success_msg', '貼文新增成功')
          res.redirect(`/admin/leisurefits`)
        })
    } catch (error) { console.log(error) }
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
    if (req.file) { img = await client.upload(req.file.path) }
    leisurefit.update({ name, CategoryId: Number(categoryId), description, image: req.file ? img.data.link : leisurefit.image })
      .then(() => {
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